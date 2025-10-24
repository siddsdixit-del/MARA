"""
MARA HCP - GPU Metrics Exporter
Exports GPU metrics to Prometheus
"""

from prometheus_client import start_http_server, Gauge, Counter, Histogram
import time
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Prometheus metrics
gpu_temperature = Gauge('mara_gpu_temperature_celsius', 'GPU temperature', ['gpu_id', 'facility'])
gpu_utilization = Gauge('mara_gpu_utilization_percent', 'GPU utilization', ['gpu_id', 'facility'])
gpu_memory_used = Gauge('mara_gpu_memory_used_bytes', 'GPU memory used', ['gpu_id', 'facility'])
gpu_memory_total = Gauge('mara_gpu_memory_total_bytes', 'GPU memory total', ['gpu_id', 'facility'])
gpu_power_draw = Gauge('mara_gpu_power_draw_watts', 'GPU power draw', ['gpu_id', 'facility'])
gpu_clock_speed = Gauge('mara_gpu_clock_speed_mhz', 'GPU clock speed', ['gpu_id', 'facility'])
gpu_workload_switches = Counter('mara_gpu_workload_switches_total', 'Total workload switches', ['gpu_id', 'facility'])
gpu_errors = Counter('mara_gpu_errors_total', 'Total GPU errors', ['gpu_id', 'facility', 'error_type'])

class GPUMetricsExporter:
    """Exports GPU metrics to Prometheus"""
    
    def __init__(self, num_gpus=10, facility='texas-1', port=9400):
        self.num_gpus = num_gpus
        self.facility = facility
        self.port = port
        self.gpus = [f"gpu-{facility}-{i:04d}" for i in range(num_gpus)]
        
    def collect_metrics(self):
        """Collect and export metrics for all GPUs"""
        for gpu_id in self.gpus:
            # Simulate GPU metrics
            is_active = random.random() > 0.2  # 80% active
            
            if is_active:
                temp = random.uniform(55, 75)
                util = random.uniform(80, 99)
                mem_used = random.uniform(60, 78) * 1024 * 1024 * 1024  # 60-78 GB
                power = random.uniform(550, 700)
                clock = random.uniform(1800, 1980)
            else:
                temp = random.uniform(40, 50)
                util = random.uniform(0, 10)
                mem_used = random.uniform(1, 5) * 1024 * 1024 * 1024  # 1-5 GB
                power = random.uniform(50, 150)
                clock = 1000
            
            # Export metrics
            gpu_temperature.labels(gpu_id=gpu_id, facility=self.facility).set(temp)
            gpu_utilization.labels(gpu_id=gpu_id, facility=self.facility).set(util)
            gpu_memory_used.labels(gpu_id=gpu_id, facility=self.facility).set(mem_used)
            gpu_memory_total.labels(gpu_id=gpu_id, facility=self.facility).set(80 * 1024 * 1024 * 1024)
            gpu_power_draw.labels(gpu_id=gpu_id, facility=self.facility).set(power)
            gpu_clock_speed.labels(gpu_id=gpu_id, facility=self.facility).set(clock)
            
            # Occasional errors
            if random.random() < 0.01:  # 1% chance
                error_type = random.choice(['ecc', 'thermal', 'memory'])
                gpu_errors.labels(gpu_id=gpu_id, facility=self.facility, error_type=error_type).inc()
    
    def run(self):
        """Start the metrics exporter"""
        logger.info(f"Starting GPU Metrics Exporter on port {self.port}")
        logger.info(f"Facility: {self.facility}, GPUs: {self.num_gpus}")
        
        start_http_server(self.port)
        logger.info(f"Metrics available at http://localhost:{self.port}/metrics")
        
        while True:
            self.collect_metrics()
            time.sleep(15)  # Collect every 15 seconds


if __name__ == "__main__":
    exporter = GPUMetricsExporter(num_gpus=10, facility='texas-1', port=9400)
    exporter.run()

