"""
MARA HCP GPU Simulator
Simulates NVIDIA H100 GPU behavior with realistic metrics
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
class GPUMetrics:
    """GPU metrics data class"""
    timestamp: str
    gpu_id: str
    facility_id: str
    model: str
    utilization: float  # 0-100%
    memory_used_mb: int
    memory_total_mb: int
    temperature_c: float
    power_draw_w: float
    clock_speed_mhz: int
    workload_id: Optional[str] = None
    
    def to_dict(self) -> Dict:
        return asdict(self)


class GPUSimulator:
    """Simulates NVIDIA H100 GPU behavior"""
    
    def __init__(
        self,
        gpu_id: str,
        facility_id: str = "texas-1",
        model: str = "H100",
        kafka_brokers: list = None
    ):
        self.gpu_id = gpu_id
        self.facility_id = facility_id
        self.model = model
        self.memory_total_mb = 80 * 1024  # 80GB
        self.max_power_w = 700  # Watts
        self.base_temp_c = 45.0
        self.max_clock_mhz = 1980
        self.idle_clock_mhz = 1000
        
        self.current_workload: Optional[str] = None
        self.is_running = False
        
        # Kafka producer for metrics
        if kafka_brokers is None:
            kafka_brokers = ['localhost:9092']
        
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=kafka_brokers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                key_serializer=lambda k: k.encode('utf-8') if k else None
            )
            logger.info(f"Connected to Kafka: {kafka_brokers}")
        except Exception as e:
            logger.warning(f"Failed to connect to Kafka: {e}. Metrics will be logged only.")
            self.producer = None
    
    async def start(self):
        """Start the GPU simulator"""
        self.is_running = True
        logger.info(f"Starting GPU simulator: {self.gpu_id}")
        await self._simulate_loop()
    
    async def stop(self):
        """Stop the GPU simulator"""
        self.is_running = False
        if self.producer:
            self.producer.close()
        logger.info(f"Stopped GPU simulator: {self.gpu_id}")
    
    async def _simulate_loop(self):
        """Main simulation loop"""
        while self.is_running:
            metrics = self._generate_metrics()
            await self._publish_metrics(metrics)
            await asyncio.sleep(1)  # Update every second
    
    def _generate_metrics(self) -> GPUMetrics:
        """Generate realistic GPU metrics based on current state"""
        if self.current_workload:
            # High utilization when running workload
            utilization = random.uniform(85, 99)
            memory_used_mb = int(self.memory_total_mb * random.uniform(0.7, 0.95))
            power_draw_w = self.max_power_w * random.uniform(0.8, 0.98)
            temp_increase = random.uniform(15, 25)
            clock_speed_mhz = self.max_clock_mhz
        else:
            # Idle state
            utilization = random.uniform(0, 5)
            memory_used_mb = int(self.memory_total_mb * 0.05)
            power_draw_w = self.max_power_w * 0.15
            temp_increase = 0
            clock_speed_mhz = self.idle_clock_mhz
        
        return GPUMetrics(
            timestamp=datetime.utcnow().isoformat() + 'Z',
            gpu_id=self.gpu_id,
            facility_id=self.facility_id,
            model=self.model,
            utilization=round(utilization, 2),
            memory_used_mb=memory_used_mb,
            memory_total_mb=self.memory_total_mb,
            temperature_c=round(self.base_temp_c + temp_increase, 1),
            power_draw_w=round(power_draw_w, 1),
            clock_speed_mhz=clock_speed_mhz,
            workload_id=self.current_workload
        )
    
    async def _publish_metrics(self, metrics: GPUMetrics):
        """Publish metrics to Kafka"""
        metrics_dict = metrics.to_dict()
        
        # Log metrics
        logger.info(
            f"GPU {self.gpu_id}: "
            f"Util={metrics.utilization:.1f}% "
            f"Temp={metrics.temperature_c:.1f}°C "
            f"Power={metrics.power_draw_w:.0f}W "
            f"Workload={metrics.workload_id or 'idle'}"
        )
        
        # Send to Kafka
        if self.producer:
            try:
                self.producer.send(
                    'gpu-metrics',
                    key=self.gpu_id,
                    value=metrics_dict
                )
            except Exception as e:
                logger.error(f"Failed to send metrics to Kafka: {e}")
    
    def assign_workload(self, workload_id: str):
        """Assign a workload to this GPU"""
        self.current_workload = workload_id
        logger.info(f"GPU {self.gpu_id}: Assigned workload {workload_id}")
    
    def release_workload(self):
        """Release the current workload"""
        old_workload = self.current_workload
        self.current_workload = None
        logger.info(f"GPU {self.gpu_id}: Released workload {old_workload}")


class SimulatorFleet:
    """Manages a fleet of GPU simulators"""
    
    def __init__(self, num_gpus: int = 10, facility_id: str = "texas-1"):
        self.num_gpus = num_gpus
        self.facility_id = facility_id
        self.gpus = []
        
        # Create GPU simulators
        for i in range(num_gpus):
            gpu_id = f"gpu-{facility_id}-{i:04d}"
            gpu = GPUSimulator(
                gpu_id=gpu_id,
                facility_id=facility_id,
                model="H100"
            )
            self.gpus.append(gpu)
        
        logger.info(f"Created fleet of {num_gpus} GPU simulators")
    
    async def start_all(self):
        """Start all GPU simulators"""
        tasks = [gpu.start() for gpu in self.gpus]
        await asyncio.gather(*tasks)
    
    async def simulate_workload_allocation(self):
        """Simulate random workload allocations"""
        while True:
            await asyncio.sleep(random.uniform(10, 30))
            
            # Pick a random idle GPU
            idle_gpus = [gpu for gpu in self.gpus if gpu.current_workload is None]
            if idle_gpus:
                gpu = random.choice(idle_gpus)
                workload_id = f"wl-{int(time.time())}"
                gpu.assign_workload(workload_id)
                
                # Release after some time
                asyncio.create_task(self._release_after_delay(gpu, random.uniform(30, 120)))
    
    async def _release_after_delay(self, gpu: GPUSimulator, delay: float):
        """Release workload after delay"""
        await asyncio.sleep(delay)
        gpu.release_workload()


async def main():
    """Main entry point"""
    # Create a fleet of 10 GPUs
    fleet = SimulatorFleet(num_gpus=10, facility_id="texas-1")
    
    # Start all simulators
    logger.info("Starting GPU simulator fleet...")
    
    # Run workload simulation in background
    asyncio.create_task(fleet.simulate_workload_allocation())
    
    # Start all GPUs
    await fleet.start_all()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Shutting down GPU simulator...")

