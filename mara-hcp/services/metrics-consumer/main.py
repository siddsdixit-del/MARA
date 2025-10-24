"""
MARA HCP Metrics Consumer
Consumes metrics from Kafka and stores them in TimescaleDB
"""

import json
import logging
import os
from datetime import datetime
from kafka import KafkaConsumer
import psycopg2
from psycopg2.extras import execute_values
import signal
import sys

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class MetricsConsumer:
    """Consumes metrics from Kafka and stores in TimescaleDB"""
    
    def __init__(self):
        # Kafka configuration
        kafka_brokers = os.getenv('KAFKA_BROKERS', 'localhost:9092').split(',')
        
        # Database configuration
        self.db_config = {
            'host': os.getenv('TIMESCALE_HOST', 'localhost'),
            'port': int(os.getenv('TIMESCALE_PORT', '5433')),
            'database': os.getenv('TIMESCALE_DB', 'mara_metrics'),
            'user': os.getenv('TIMESCALE_USER', 'mara'),
            'password': os.getenv('TIMESCALE_PASSWORD', 'dev_password'),
        }
        
        # Connect to database
        try:
            self.conn = psycopg2.connect(**self.db_config)
            self.conn.autocommit = True
            logger.info("Connected to TimescaleDB")
        except Exception as e:
            logger.error(f"Failed to connect to TimescaleDB: {e}")
            sys.exit(1)
        
        # Create Kafka consumers
        consumer_config = {
            'bootstrap_servers': kafka_brokers,
            'value_deserializer': lambda m: json.loads(m.decode('utf-8')),
            'auto_offset_reset': 'latest',
            'enable_auto_commit': True,
            'group_id': 'metrics-consumer-group'
        }
        
        try:
            self.gpu_consumer = KafkaConsumer('gpu-metrics', **consumer_config)
            self.asic_consumer = KafkaConsumer('asic-metrics', **consumer_config)
            self.price_consumer = KafkaConsumer('price-data', **consumer_config)
            logger.info(f"Connected to Kafka: {kafka_brokers}")
        except Exception as e:
            logger.error(f"Failed to connect to Kafka: {e}")
            sys.exit(1)
        
        self.is_running = True
    
    def store_gpu_metrics(self, metrics: dict):
        """Store GPU metrics in TimescaleDB"""
        try:
            cursor = self.conn.cursor()
            
            # Insert metrics
            queries = [
                ('utilization', metrics['utilization']),
                ('temperature_c', metrics['temperature_c']),
                ('power_draw_w', metrics['power_draw_w']),
                ('memory_used_mb', metrics['memory_used_mb']),
            ]
            
            for metric_name, value in queries:
                cursor.execute("""
                    INSERT INTO metrics (time, resource_id, metric_name, value, tags)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    metrics['timestamp'],
                    metrics['gpu_id'],
                    metric_name,
                    value,
                    json.dumps({
                        'facility_id': metrics['facility_id'],
                        'model': metrics['model'],
                        'workload_id': metrics.get('workload_id')
                    })
                ))
            
            cursor.close()
            logger.debug(f"Stored GPU metrics for {metrics['gpu_id']}")
            
        except Exception as e:
            logger.error(f"Error storing GPU metrics: {e}")
    
    def store_asic_metrics(self, metrics: dict):
        """Store ASIC metrics in TimescaleDB"""
        try:
            cursor = self.conn.cursor()
            
            queries = [
                ('hash_rate_ths', metrics['hash_rate_ths']),
                ('temperature_c', metrics['temperature_c']),
                ('power_draw_w', metrics['power_draw_w']),
                ('accepted_shares', metrics['accepted_shares']),
                ('rejected_shares', metrics['rejected_shares']),
            ]
            
            for metric_name, value in queries:
                cursor.execute("""
                    INSERT INTO metrics (time, resource_id, metric_name, value, tags)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    metrics['timestamp'],
                    metrics['asic_id'],
                    metric_name,
                    value,
                    json.dumps({
                        'facility_id': metrics['facility_id'],
                        'model': metrics['model'],
                        'is_mining': metrics['is_mining'],
                        'pool': metrics.get('pool')
                    })
                ))
            
            cursor.close()
            logger.debug(f"Stored ASIC metrics for {metrics['asic_id']}")
            
        except Exception as e:
            logger.error(f"Error storing ASIC metrics: {e}")
    
    def store_price_data(self, price: dict):
        """Store price data in TimescaleDB"""
        try:
            cursor = self.conn.cursor()
            
            cursor.execute("""
                INSERT INTO price_data (time, price_type, value, unit, source, region, metadata)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                price['timestamp'],
                price['price_type'],
                price['value'],
                price['unit'],
                price['source'],
                price.get('region'),
                json.dumps(price.get('metadata', {}))
            ))
            
            cursor.close()
            logger.info(
                f"📊 Stored price: {price['price_type']} = "
                f"${price['value']} {price['unit']}"
            )
            
        except Exception as e:
            logger.error(f"Error storing price data: {e}")
    
    def consume_gpu_metrics(self):
        """Consume GPU metrics from Kafka"""
        for message in self.gpu_consumer:
            if not self.is_running:
                break
            self.store_gpu_metrics(message.value)
    
    def consume_asic_metrics(self):
        """Consume ASIC metrics from Kafka"""
        for message in self.asic_consumer:
            if not self.is_running:
                break
            self.store_asic_metrics(message.value)
    
    def consume_price_data(self):
        """Consume price data from Kafka"""
        for message in self.price_consumer:
            if not self.is_running:
                break
            self.store_price_data(message.value)
    
    def shutdown(self):
        """Gracefully shutdown the consumer"""
        logger.info("Shutting down metrics consumer...")
        self.is_running = False
        
        if hasattr(self, 'gpu_consumer'):
            self.gpu_consumer.close()
        if hasattr(self, 'asic_consumer'):
            self.asic_consumer.close()
        if hasattr(self, 'price_consumer'):
            self.price_consumer.close()
        
        if hasattr(self, 'conn'):
            self.conn.close()
        
        logger.info("Metrics consumer stopped")


def signal_handler(signum, frame):
    """Handle shutdown signals"""
    logger.info("Received shutdown signal")
    if 'consumer' in globals():
        consumer.shutdown()
    sys.exit(0)


def main():
    """Main entry point"""
    global consumer
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    consumer = MetricsConsumer()
    
    logger.info("Starting metrics consumer...")
    logger.info("Consuming from topics: gpu-metrics, asic-metrics, price-data")
    
    # Note: In production, use separate threads or async for each consumer
    # For simplicity, this alternates between consumers
    import threading
    
    threads = [
        threading.Thread(target=consumer.consume_gpu_metrics, daemon=True),
        threading.Thread(target=consumer.consume_asic_metrics, daemon=True),
        threading.Thread(target=consumer.consume_price_data, daemon=True),
    ]
    
    for thread in threads:
        thread.start()
    
    # Keep main thread alive
    for thread in threads:
        thread.join()


if __name__ == "__main__":
    main()

