"""
MARA HCP - Notification Service
Multi-channel notifications (Email, SMS, Webhook)
"""

import asyncio
import json
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict
from enum import Enum
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NotificationType(Enum):
    EMAIL = "email"
    SMS = "sms"
    WEBHOOK = "webhook"
    SLACK = "slack"


class NotificationPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


@dataclass
class Notification:
    """Notification message"""
    id: str
    customer_id: str
    type: str
    priority: str
    subject: str
    message: str
    recipients: List[str]
    status: str = "pending"
    sent_at: Optional[str] = None
    metadata: Optional[Dict] = None
    
    def to_dict(self) -> Dict:
        return asdict(self)


class EmailSender:
    """Email notification sender (SendGrid/SES)"""
    
    async def send(self, notification: Notification) -> bool:
        """Send email notification"""
        logger.info(f"📧 Sending email to {len(notification.recipients)} recipients")
        logger.info(f"   Subject: {notification.subject}")
        
        # Simulate email sending
        await asyncio.sleep(0.5)
        
        logger.info(f"✅ Email sent successfully")
        return True


class SMSSender:
    """SMS notification sender (Twilio)"""
    
    async def send(self, notification: Notification) -> bool:
        """Send SMS notification"""
        logger.info(f"📱 Sending SMS to {len(notification.recipients)} recipients")
        logger.info(f"   Message: {notification.message[:50]}...")
        
        # Simulate SMS sending
        await asyncio.sleep(0.3)
        
        logger.info(f"✅ SMS sent successfully")
        return True


class WebhookSender:
    """Webhook notification sender"""
    
    async def send(self, notification: Notification) -> bool:
        """Send webhook notification"""
        logger.info(f"🔗 Sending webhook to {len(notification.recipients)} endpoints")
        
        # Simulate webhook POST
        await asyncio.sleep(0.2)
        
        logger.info(f"✅ Webhook sent successfully")
        return True


class NotificationService:
    """Main notification service"""
    
    def __init__(self):
        self.email_sender = EmailSender()
        self.sms_sender = SMSSender()
        self.webhook_sender = WebhookSender()
        self.notification_queue = asyncio.Queue()
        self.sent_notifications = []
        
    async def queue_notification(self, notification: Notification):
        """Add notification to queue"""
        await self.notification_queue.put(notification)
        logger.info(f"Queued notification {notification.id} ({notification.type})")
    
    async def process_queue(self):
        """Process notification queue"""
        while True:
            try:
                notification = await self.notification_queue.get()
                await self.send_notification(notification)
                self.notification_queue.task_done()
            except Exception as e:
                logger.error(f"Error processing notification: {e}")
    
    async def send_notification(self, notification: Notification) -> bool:
        """Send notification via appropriate channel"""
        logger.info(f"\n{'='*60}")
        logger.info(f"🔔 Processing Notification {notification.id}")
        logger.info(f"   Type: {notification.type}")
        logger.info(f"   Priority: {notification.priority}")
        logger.info(f"{'='*60}")
        
        success = False
        
        try:
            if notification.type == NotificationType.EMAIL.value:
                success = await self.email_sender.send(notification)
            elif notification.type == NotificationType.SMS.value:
                success = await self.sms_sender.send(notification)
            elif notification.type == NotificationType.WEBHOOK.value:
                success = await self.webhook_sender.send(notification)
            else:
                logger.warning(f"Unknown notification type: {notification.type}")
                return False
            
            if success:
                notification.status = "sent"
                notification.sent_at = datetime.utcnow().isoformat() + 'Z'
                self.sent_notifications.append(notification)
            else:
                notification.status = "failed"
            
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")
            notification.status = "failed"
            success = False
        
        return success
    
    async def send_alert(
        self,
        customer_id: str,
        alert_type: str,
        severity: str,
        message: str,
        channels: List[str] = None
    ):
        """Send alert notification"""
        if channels is None:
            channels = ["email"]  # Default to email
        
        for channel in channels:
            notification = Notification(
                id=f"alert-{datetime.now().timestamp()}",
                customer_id=customer_id,
                type=channel,
                priority=severity,
                subject=f"[{severity.upper()}] {alert_type}",
                message=message,
                recipients=self.get_customer_contacts(customer_id, channel),
                metadata={"alert_type": alert_type}
            )
            
            await self.queue_notification(notification)
    
    def get_customer_contacts(self, customer_id: str, channel: str) -> List[str]:
        """Get customer contact info for channel"""
        # Simulated customer contacts
        contacts = {
            "email": [f"{customer_id}@example.com", "admin@example.com"],
            "sms": ["+1234567890"],
            "webhook": ["https://api.customer.com/webhooks/mara"]
        }
        return contacts.get(channel, [])
    
    def get_stats(self) -> Dict:
        """Get notification statistics"""
        total = len(self.sent_notifications)
        by_type = {}
        by_status = {}
        
        for notif in self.sent_notifications:
            by_type[notif.type] = by_type.get(notif.type, 0) + 1
            by_status[notif.status] = by_status.get(notif.status, 0) + 1
        
        return {
            "total_sent": total,
            "by_type": by_type,
            "by_status": by_status,
            "queue_size": self.notification_queue.qsize()
        }


async def demo_notifications():
    """Demo notification system"""
    service = NotificationService()
    
    logger.info("\n" + "="*60)
    logger.info("🔔 MARA HCP - Notification Service Demo")
    logger.info("="*60 + "\n")
    
    # Start queue processor
    asyncio.create_task(service.process_queue())
    
    # Test 1: High temperature alert
    logger.info("📍 Test 1: High Temperature Alert")
    await service.send_alert(
        customer_id="cust-001",
        alert_type="HighGPUTemperature",
        severity="warning",
        message="GPU gpu-texas-1-0001 temperature is 85°C (threshold: 80°C)",
        channels=["email", "sms"]
    )
    
    await asyncio.sleep(2)
    
    # Test 2: Workload completion
    logger.info("\n📍 Test 2: Workload Completion Notification")
    notification = Notification(
        id="notif-001",
        customer_id="cust-001",
        type="email",
        priority="low",
        subject="Workload Completed",
        message="Your AI training workload has completed successfully. Results are available in your dashboard.",
        recipients=["user@example.com"]
    )
    await service.queue_notification(notification)
    
    await asyncio.sleep(2)
    
    # Test 3: Billing notification
    logger.info("\n📍 Test 3: Billing Notification")
    notification = Notification(
        id="notif-002",
        customer_id="cust-001",
        type="email",
        priority="medium",
        subject="Invoice Ready",
        message="Your monthly invoice for $648.00 is ready. Payment is due in 30 days.",
        recipients=["billing@example.com"]
    )
    await service.queue_notification(notification)
    
    await asyncio.sleep(2)
    
    # Test 4: Critical alert webhook
    logger.info("\n📍 Test 4: Critical Alert via Webhook")
    await service.send_alert(
        customer_id="cust-001",
        alert_type="CriticalGPUTemperature",
        severity="urgent",
        message="CRITICAL: GPU gpu-texas-1-0001 temperature is 92°C! Immediate attention required.",
        channels=["webhook", "sms", "email"]
    )
    
    await asyncio.sleep(3)
    
    # Stats
    logger.info("\n" + "="*60)
    logger.info("📊 NOTIFICATION STATISTICS")
    logger.info("="*60)
    
    stats = service.get_stats()
    for key, value in stats.items():
        logger.info(f"  {key}: {value}")
    
    logger.info("\n" + "="*60)
    logger.info("✅ Demo Complete!")
    logger.info("="*60)


if __name__ == "__main__":
    asyncio.run(demo_notifications())

