"""
MARA HCP - Workload Execution Engine
Handles execution of AI inference and Bitcoin mining workloads with fast switching
"""

import asyncio
import time
import json
from dataclasses import dataclass, asdict
from typing import Optional, Dict, List
from enum import Enum
from kafka import KafkaProducer, KafkaConsumer
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class WorkloadType(Enum):
    AI_INFERENCE_REALTIME = "ai_inference_realtime"
    AI_INFERENCE_BATCH = "ai_inference_batch"
    MODEL_TRAINING = "model_training"
    BITCOIN_MINING = "bitcoin_mining"


class ExecutionStatus(Enum):
    PENDING = "pending"
    STARTING = "starting"
    RUNNING = "running"
    SWITCHING = "switching"
    STOPPING = "stopping"
    STOPPED = "stopped"
    FAILED = "failed"


@dataclass
class WorkloadExecution:
    """Represents a workload execution"""
    workload_id: str
    resource_id: str
    workload_type: str
    status: str
    started_at: Optional[float] = None
    stopped_at: Optional[float] = None
    switch_count: int = 0
    total_execution_time: float = 0.0
    
    def to_dict(self) -> Dict:
        return asdict(self)


class FastSwitcher:
    """
    Handles ultra-fast workload switching (<100ms)
    Uses pre-warming and state caching for minimal downtime
    """
    
    def __init__(self):
        self.switch_history: List[Dict] = []
        self.prewarmed_workloads: Dict[str, Dict] = {}
        
    async def switch_workload(
        self,
        resource_id: str,
        from_workload: Optional[WorkloadExecution],
        to_workload: WorkloadExecution
    ) -> float:
        """
        Switch from one workload to another in <100ms
        
        Returns: switch duration in seconds
        """
        start_time = time.time()
        
        logger.info(
            f"🔄 Fast switching on {resource_id}: "
            f"{from_workload.workload_type if from_workload else 'idle'} → "
            f"{to_workload.workload_type}"
        )
        
        # Step 1: Checkpoint current workload (10-20ms)
        if from_workload:
            await self._checkpoint_workload(from_workload)
        
        # Step 2: Prepare new workload (20-30ms)
        await self._prepare_workload(to_workload)
        
        # Step 3: Fast state transfer (30-40ms)
        await self._transfer_state(resource_id, from_workload, to_workload)
        
        # Step 4: Activate new workload (10-20ms)
        await self._activate_workload(to_workload)
        
        switch_duration = time.time() - start_time
        
        # Record switch
        switch_record = {
            "resource_id": resource_id,
            "from_workload": from_workload.workload_type if from_workload else None,
            "to_workload": to_workload.workload_type,
            "duration_ms": switch_duration * 1000,
            "timestamp": time.time()
        }
        self.switch_history.append(switch_record)
        
        logger.info(
            f"✅ Switch complete: {switch_duration*1000:.2f}ms "
            f"({'✓ UNDER 100ms' if switch_duration < 0.1 else '✗ OVER 100ms'})"
        )
        
        return switch_duration
    
    async def _checkpoint_workload(self, workload: WorkloadExecution):
        """Save current workload state"""
        await asyncio.sleep(0.015)  # Simulate checkpoint (15ms)
        logger.debug(f"  ↳ Checkpointed {workload.workload_type}")
    
    async def _prepare_workload(self, workload: WorkloadExecution):
        """Prepare new workload for execution"""
        await asyncio.sleep(0.025)  # Simulate prep (25ms)
        logger.debug(f"  ↳ Prepared {workload.workload_type}")
    
    async def _transfer_state(
        self,
        resource_id: str,
        from_workload: Optional[WorkloadExecution],
        to_workload: WorkloadExecution
    ):
        """Fast state transfer between workloads"""
        await asyncio.sleep(0.035)  # Simulate transfer (35ms)
        logger.debug(f"  ↳ State transferred on {resource_id}")
    
    async def _activate_workload(self, workload: WorkloadExecution):
        """Activate the new workload"""
        await asyncio.sleep(0.015)  # Simulate activation (15ms)
        workload.status = ExecutionStatus.RUNNING.value
        workload.started_at = time.time()
        logger.debug(f"  ↳ Activated {workload.workload_type}")
    
    def get_average_switch_time(self) -> float:
        """Get average switch time in milliseconds"""
        if not self.switch_history:
            return 0.0
        
        total = sum(s["duration_ms"] for s in self.switch_history)
        return total / len(self.switch_history)


class WorkloadExecutionEngine:
    """
    Main workload execution engine
    Manages workload lifecycle and coordinates fast switching
    """
    
    def __init__(self, kafka_brokers: List[str] = None):
        if kafka_brokers is None:
            kafka_brokers = ['localhost:9092']
        
        self.kafka_brokers = kafka_brokers
        self.executions: Dict[str, WorkloadExecution] = {}
        self.resource_assignments: Dict[str, str] = {}  # resource_id -> workload_id
        self.fast_switcher = FastSwitcher()
        
        # Kafka producer for execution events
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=kafka_brokers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            logger.info("Connected to Kafka")
        except Exception as e:
            logger.warning(f"Failed to connect to Kafka: {e}")
            self.producer = None
        
        # Kafka consumer for workload commands
        try:
            self.consumer = KafkaConsumer(
                'workload-commands',
                bootstrap_servers=kafka_brokers,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                group_id='execution-engine-group',
                auto_offset_reset='latest'
            )
            logger.info("Subscribed to workload commands")
        except Exception as e:
            logger.warning(f"Failed to subscribe to Kafka: {e}")
            self.consumer = None
    
    async def execute_workload(
        self,
        workload_id: str,
        resource_id: str,
        workload_type: str
    ) -> WorkloadExecution:
        """
        Execute a workload on a resource
        """
        execution = WorkloadExecution(
            workload_id=workload_id,
            resource_id=resource_id,
            workload_type=workload_type,
            status=ExecutionStatus.STARTING.value,
            started_at=time.time()
        )
        
        self.executions[workload_id] = execution
        self.resource_assignments[resource_id] = workload_id
        
        logger.info(
            f"▶️  Executing workload {workload_id} "
            f"({workload_type}) on {resource_id}"
        )
        
        # Simulate workload startup
        await asyncio.sleep(0.5)
        
        execution.status = ExecutionStatus.RUNNING.value
        
        # Publish execution event
        self._publish_event("workload_started", execution.to_dict())
        
        return execution
    
    async def stop_workload(self, workload_id: str) -> float:
        """
        Stop a running workload
        Returns: execution duration in seconds
        """
        execution = self.executions.get(workload_id)
        if not execution:
            logger.warning(f"Workload {workload_id} not found")
            return 0.0
        
        logger.info(f"⏹️  Stopping workload {workload_id}")
        
        execution.status = ExecutionStatus.STOPPING.value
        
        # Simulate graceful shutdown
        await asyncio.sleep(0.2)
        
        execution.status = ExecutionStatus.STOPPED.value
        execution.stopped_at = time.time()
        
        if execution.started_at:
            duration = execution.stopped_at - execution.started_at
            execution.total_execution_time = duration
        
        # Remove resource assignment
        resource_id = execution.resource_id
        if self.resource_assignments.get(resource_id) == workload_id:
            del self.resource_assignments[resource_id]
        
        # Publish event
        self._publish_event("workload_stopped", execution.to_dict())
        
        return execution.total_execution_time
    
    async def switch_workload(
        self,
        resource_id: str,
        new_workload_id: str,
        new_workload_type: str
    ) -> float:
        """
        Fast-switch to a new workload on a resource
        Returns: switch duration in seconds
        """
        # Get current workload
        current_workload_id = self.resource_assignments.get(resource_id)
        current_execution = None
        
        if current_workload_id:
            current_execution = self.executions.get(current_workload_id)
            if current_execution:
                current_execution.status = ExecutionStatus.SWITCHING.value
        
        # Create new execution
        new_execution = WorkloadExecution(
            workload_id=new_workload_id,
            resource_id=resource_id,
            workload_type=new_workload_type,
            status=ExecutionStatus.STARTING.value
        )
        
        # Perform fast switch
        switch_duration = await self.fast_switcher.switch_workload(
            resource_id,
            current_execution,
            new_execution
        )
        
        # Update tracking
        if current_execution:
            current_execution.status = ExecutionStatus.STOPPED.value
            current_execution.stopped_at = time.time()
        
        self.executions[new_workload_id] = new_execution
        self.resource_assignments[resource_id] = new_workload_id
        
        # Publish event
        self._publish_event("workload_switched", {
            "resource_id": resource_id,
            "from_workload": current_workload_id,
            "to_workload": new_workload_id,
            "switch_duration_ms": switch_duration * 1000
        })
        
        return switch_duration
    
    async def preempt_workload(
        self,
        workload_id: str,
        preempted_by: str
    ) -> bool:
        """
        Preempt a lower-priority workload
        """
        execution = self.executions.get(workload_id)
        if not execution:
            return False
        
        logger.warning(
            f"⚠️  Preempting workload {workload_id} "
            f"(preempted by {preempted_by})"
        )
        
        execution.status = ExecutionStatus.STOPPED.value
        execution.stopped_at = time.time()
        
        # Save checkpoint for resume
        await self.fast_switcher._checkpoint_workload(execution)
        
        # Publish event
        self._publish_event("workload_preempted", {
            "workload_id": workload_id,
            "preempted_by": preempted_by,
            "resource_id": execution.resource_id
        })
        
        return True
    
    def get_execution_stats(self) -> Dict:
        """Get execution statistics"""
        total = len(self.executions)
        running = sum(1 for e in self.executions.values() 
                     if e.status == ExecutionStatus.RUNNING.value)
        stopped = sum(1 for e in self.executions.values() 
                     if e.status == ExecutionStatus.STOPPED.value)
        
        return {
            "total_executions": total,
            "running": running,
            "stopped": stopped,
            "active_resources": len(self.resource_assignments),
            "total_switches": len(self.fast_switcher.switch_history),
            "avg_switch_time_ms": self.fast_switcher.get_average_switch_time(),
            "sub_100ms_switches": sum(
                1 for s in self.fast_switcher.switch_history 
                if s["duration_ms"] < 100
            )
        }
    
    def _publish_event(self, event_type: str, data: Dict):
        """Publish execution event to Kafka"""
        if not self.producer:
            return
        
        event = {
            "event_type": event_type,
            "timestamp": time.time(),
            "data": data
        }
        
        try:
            self.producer.send('execution-events', value=event)
        except Exception as e:
            logger.error(f"Failed to publish event: {e}")


async def demo_fast_switching():
    """Demonstrate fast workload switching"""
    engine = WorkloadExecutionEngine()
    
    logger.info("=" * 60)
    logger.info("🚀 MARA HCP - Workload Execution Engine Demo")
    logger.info("=" * 60)
    
    # Test 1: Execute AI inference workload
    logger.info("\n📍 Test 1: Execute AI Inference Workload")
    await engine.execute_workload(
        "wl-001",
        "gpu-texas-1-0001",
        WorkloadType.AI_INFERENCE_REALTIME.value
    )
    
    await asyncio.sleep(2)
    
    # Test 2: Fast switch to Bitcoin mining
    logger.info("\n📍 Test 2: Fast Switch to Bitcoin Mining")
    switch_time = await engine.switch_workload(
        "gpu-texas-1-0001",
        "wl-002",
        WorkloadType.BITCOIN_MINING.value
    )
    
    logger.info(f"⏱️  Switch completed in {switch_time*1000:.2f}ms")
    
    await asyncio.sleep(2)
    
    # Test 3: Fast switch back to AI
    logger.info("\n📍 Test 3: Fast Switch Back to AI Inference")
    switch_time = await engine.switch_workload(
        "gpu-texas-1-0001",
        "wl-003",
        WorkloadType.MODEL_TRAINING.value
    )
    
    logger.info(f"⏱️  Switch completed in {switch_time*1000:.2f}ms")
    
    await asyncio.sleep(2)
    
    # Test 4: Multiple rapid switches
    logger.info("\n📍 Test 4: Multiple Rapid Switches (Stress Test)")
    workload_types = [
        WorkloadType.AI_INFERENCE_REALTIME.value,
        WorkloadType.BITCOIN_MINING.value,
        WorkloadType.AI_INFERENCE_BATCH.value,
        WorkloadType.MODEL_TRAINING.value,
    ]
    
    for i in range(5):
        workload_type = workload_types[i % len(workload_types)]
        switch_time = await engine.switch_workload(
            "gpu-texas-1-0001",
            f"wl-{100+i}",
            workload_type
        )
        logger.info(f"  Switch {i+1}: {switch_time*1000:.2f}ms")
        await asyncio.sleep(0.5)
    
    # Stats
    logger.info("\n" + "=" * 60)
    logger.info("📊 EXECUTION STATISTICS")
    logger.info("=" * 60)
    
    stats = engine.get_execution_stats()
    for key, value in stats.items():
        logger.info(f"  {key}: {value}")
    
    logger.info("\n" + "=" * 60)
    logger.info("✅ Demo Complete!")
    logger.info("=" * 60)


if __name__ == "__main__":
    asyncio.run(demo_fast_switching())

