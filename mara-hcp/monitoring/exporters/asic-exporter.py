"""
MARA HCP - ASIC Metrics Exporter
Exports Bitcoin mining ASIC metrics to Prometheus
"""

from prometheus_client import start_http_server, Gauge, Counter
import time
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Prometheus metrics
asic_hash_rate = Gauge('mara_asic_hash_rate_ths', 'ASIC hash rate TH/s', ['asic_id', 'facility'])
asic_temperature = Gauge('mara_asic_temperature_celsius', 'ASIC temperature', ['asic_id', 'facility'])
asic_power_draw = Gauge('mara_asic_power_draw_watts', 'ASIC power draw', ['asic_id', 'facility'])
asic_efficiency = Gauge('mara_asic_efficiency_j_th', 'ASIC efficiency J/TH', ['asic_id', 'facility'])
asic_shares_accepted = Counter('mara_asic_shares_accepted_total', 'Accepted shares', ['asic_id', 'facility', 'pool'])
asic_shares_rejected = Counter('mara_asic_shares_rejected_total', 'Rejected shares', ['asic_id', 'facility', 'pool'])
asic_hardware_errors = Counter('mara_asic_hardware_errors_total', 'Hardware errors', ['asic_id', 'facility'])
asic_uptime_seconds = Gauge('mara_asic_uptime_seconds', 'ASIC uptime', ['asic_id', 'facility'])

class ASICMetricsExporter:
    """Exports ASIC metrics to Prometheus"""
    
    def __init__(self, num_asics=50, facility='texas-1', port=9401):
        self.num_asics = num_asics
        self.facility = facility
        self.port = port
        self.asics = [f"asic-{facility}-{i:05d}" for i in range(num_asics)]
        self.pool = 'foundry-usa'
        self.start_time = time.time()
        
    def collect_metrics(self):
        """Collect and export metrics for all ASICs"""
        for asic_id in self.asics:
            is_mining = random.random() > 0.05  # 95% mining
            
            if is_mining:
                hash_rate = random.uniform(260, 275)  # S21: 270 TH/s nominal
                temp = random.uniform(55, 70)
                power = hash_rate * 13.5  # ~13.5 J/TH efficiency
                efficiency = 13.5
                
                # Shares
                if random.random() > 0.5:
                    asic_shares_accepted.labels(
                        asic_id=asic_id, 
                        facility=self.facility,
                        pool=self.pool
                    ).inc(random.randint(1, 100))
                
                if random.random() < 0.05:  # 5% chance of rejected share
                    asic_shares_rejected.labels(
                        asic_id=asic_id,
                        facility=self.facility,
                        pool=self.pool
                    ).inc(random.randint(1, 3))
            else:
                hash_rate = 0
                temp = random.uniform(35, 45)
                power = 50  # Idle power
                efficiency = 0
            
            # Export metrics
            asic_hash_rate.labels(asic_id=asic_id, facility=self.facility).set(hash_rate)
            asic_temperature.labels(asic_id=asic_id, facility=self.facility).set(temp)
            asic_power_draw.labels(asic_id=asic_id, facility=self.facility).set(power)
            asic_efficiency.labels(asic_id=asic_id, facility=self.facility).set(efficiency)
            asic_uptime_seconds.labels(asic_id=asic_id, facility=self.facility).set(
                time.time() - self.start_time
            )
            
            # Hardware errors (rare)
            if random.random() < 0.001:  # 0.1% chance
                asic_hardware_errors.labels(asic_id=asic_id, facility=self.facility).inc()
    
    def run(self):
        """Start the metrics exporter"""
        logger.info(f"Starting ASIC Metrics Exporter on port {self.port}")
        logger.info(f"Facility: {self.facility}, ASICs: {self.num_asics}")
        
        start_http_server(self.port)
        logger.info(f"Metrics available at http://localhost:{self.port}/metrics")
        
        while True:
            self.collect_metrics()
            time.sleep(15)  # Collect every 15 seconds


if __name__ == "__main__":
    exporter = ASICMetricsExporter(num_asics=50, facility='texas-1', port=9401)
    exporter.run()

