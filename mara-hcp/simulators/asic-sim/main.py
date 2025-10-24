"""
MARA HCP ASIC Simulator
Simulates Bitcoin mining ASIC behavior (Antminer S21)
"""

import asyncio
import random
import json
import time
from dataclasses import dataclass, asdict
from typing import Optional, Dict
from datetime import datetime
from kafka import KafkaProducer
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class ASICMetrics:
    """ASIC metrics data class"""
    timestamp: str
    asic_id: str
    facility_id: str
    model: str
    hash_rate_ths: float  # TH/s
    efficiency_j_th: float  # J/TH
    temperature_c: float
    power_draw_w: float
    is_mining: bool
    hardware_errors: int
    accepted_shares: int
    rejected_shares: int
    pool: Optional[str] = None
    
    def to_dict(self) -> Dict:
        return asdict(self)


class ASICSimulator:
    """Simulates Antminer S21 ASIC behavior"""
    
    def __init__(
        self,
        asic_id: str,
        facility_id: str = "texas-1",
        model: str = "S21",
        kafka_brokers: list = None
    ):
        self.asic_id = asic_id
        self.facility_id = facility_id
        self.model = model
        self.max_hash_rate_ths = 270  # TH/s
        self.efficiency_j_th = 13.5  # J/TH
        self.base_temp_c = 35.0
        self.idle_power_w = 50
        self.mining_pool = "foundry-usa"
        
        self.is_mining = False
        self.is_running = False
        self.total_shares = 0
        self.total_errors = 0
        
        # Kafka producer
        if kafka_brokers is None:
            kafka_brokers = ['localhost:9092']
        
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=kafka_brokers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                key_serializer=lambda k: k.encode('utf-8') if k else None
            )
            logger.info(f"ASIC {asic_id}: Connected to Kafka")
        except Exception as e:
            logger.warning(f"ASIC {asic_id}: Failed to connect to Kafka: {e}")
            self.producer = None
    
    async def start(self):
        """Start the ASIC simulator"""
        self.is_running = True
        logger.info(f"Starting ASIC simulator: {self.asic_id}")
        await self._simulate_loop()
    
    async def stop(self):
        """Stop the ASIC simulator"""
        self.is_running = False
        if self.producer:
            self.producer.close()
        logger.info(f"Stopped ASIC simulator: {self.asic_id}")
    
    async def _simulate_loop(self):
        """Main simulation loop"""
        while self.is_running:
            metrics = self._generate_metrics()
            await self._publish_metrics(metrics)
            await asyncio.sleep(1)  # Update every second
    
    def _generate_metrics(self) -> ASICMetrics:
        """Generate realistic ASIC metrics"""
        if self.is_mining:
            # Mining active
            hash_rate_ths = self.max_hash_rate_ths * random.uniform(0.95, 1.0)
            power_draw_w = hash_rate_ths * self.efficiency_j_th
            temperature_c = self.base_temp_c + random.uniform(20, 35)
            hardware_errors = random.randint(0, 2)
            accepted_shares = random.randint(0, 100)
            rejected_shares = random.randint(0, 2)
            
            self.total_shares += accepted_shares
            self.total_errors += hardware_errors
        else:
            # Idle state
            hash_rate_ths = 0
            power_draw_w = self.idle_power_w
            temperature_c = self.base_temp_c
            hardware_errors = 0
            accepted_shares = 0
            rejected_shares = 0
        
        return ASICMetrics(
            timestamp=datetime.utcnow().isoformat() + 'Z',
            asic_id=self.asic_id,
            facility_id=self.facility_id,
            model=self.model,
            hash_rate_ths=round(hash_rate_ths, 2),
            efficiency_j_th=self.efficiency_j_th,
            temperature_c=round(temperature_c, 1),
            power_draw_w=round(power_draw_w, 1),
            is_mining=self.is_mining,
            hardware_errors=hardware_errors,
            accepted_shares=accepted_shares,
            rejected_shares=rejected_shares,
            pool=self.mining_pool if self.is_mining else None
        )
    
    async def _publish_metrics(self, metrics: ASICMetrics):
        """Publish metrics to Kafka"""
        metrics_dict = metrics.to_dict()
        
        # Log metrics
        if self.is_mining:
            logger.info(
                f"ASIC {self.asic_id}: "
                f"HashRate={metrics.hash_rate_ths:.1f}TH/s "
                f"Temp={metrics.temperature_c:.1f}°C "
                f"Power={metrics.power_draw_w:.0f}W "
                f"Shares={metrics.accepted_shares}/{metrics.rejected_shares}"
            )
        
        # Send to Kafka
        if self.producer:
            try:
                self.producer.send(
                    'asic-metrics',
                    key=self.asic_id,
                    value=metrics_dict
                )
            except Exception as e:
                logger.error(f"Failed to send metrics to Kafka: {e}")
    
    def start_mining(self):
        """Start Bitcoin mining"""
        self.is_mining = True
        logger.info(f"ASIC {self.asic_id}: Started mining")
    
    def stop_mining(self):
        """Stop Bitcoin mining"""
        self.is_mining = False
        logger.info(f"ASIC {self.asic_id}: Stopped mining")


class ASICFleet:
    """Manages a fleet of ASIC miners"""
    
    def __init__(self, num_asics: int = 50, facility_id: str = "texas-1"):
        self.num_asics = num_asics
        self.facility_id = facility_id
        self.asics = []
        
        # Create ASIC simulators
        for i in range(num_asics):
            asic_id = f"asic-{facility_id}-{i:05d}"
            asic = ASICSimulator(
                asic_id=asic_id,
                facility_id=facility_id,
                model="S21"
            )
            self.asics.append(asic)
        
        logger.info(f"Created fleet of {num_asics} ASIC simulators")
    
    async def start_all(self):
        """Start all ASIC simulators"""
        # Start all ASICs mining by default
        for asic in self.asics:
            asic.start_mining()
        
        tasks = [asic.start() for asic in self.asics]
        await asyncio.gather(*tasks)
    
    async def simulate_mining_switches(self):
        """Simulate mining on/off based on profitability"""
        while True:
            await asyncio.sleep(random.uniform(60, 180))
            
            # Randomly stop/start some ASICs (simulating economic switching)
            num_to_switch = random.randint(1, 5)
            asics_to_switch = random.sample(self.asics, min(num_to_switch, len(self.asics)))
            
            for asic in asics_to_switch:
                if asic.is_mining:
                    asic.stop_mining()
                else:
                    asic.start_mining()


async def main():
    """Main entry point"""
    # Create a fleet of 50 ASICs
    fleet = ASICFleet(num_asics=50, facility_id="texas-1")
    
    logger.info("Starting ASIC simulator fleet...")
    
    # Run mining switch simulation in background
    asyncio.create_task(fleet.simulate_mining_switches())
    
    # Start all ASICs
    await fleet.start_all()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Shutting down ASIC simulator...")

