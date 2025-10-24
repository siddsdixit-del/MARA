"""
MARA HCP Market Data Simulator
Simulates real-time market prices for economic optimization
"""

import asyncio
import random
import json
import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict
from datetime import datetime, time as dt_time
from kafka import KafkaProducer
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class PriceData:
    """Price data structure"""
    timestamp: str
    price_type: str  # 'electricity', 'btc', 'gpu_spot'
    value: float
    unit: str
    source: str
    region: str = None
    metadata: Dict = None
    
    def to_dict(self) -> Dict:
        return asdict(self)


class MarketDataSimulator:
    """Simulates market data for optimization decisions"""
    
    def __init__(self, kafka_brokers: list = None):
        # Initial prices
        self.btc_price = 65000.0  # USD
        self.electricity_price = 0.04  # USD/kWh
        self.gpu_spot_rate = 2.50  # USD/GPU-hour
        
        # Kafka producer
        if kafka_brokers is None:
            kafka_brokers = ['localhost:9092']
        
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=kafka_brokers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            logger.info("Connected to Kafka for market data")
        except Exception as e:
            logger.warning(f"Failed to connect to Kafka: {e}")
            self.producer = None
    
    def generate_btc_price(self) -> float:
        """Generate realistic BTC price using Geometric Brownian Motion"""
        dt = 1/24  # hourly intervals
        mu = 0.0001  # drift (slight upward trend)
        sigma = 0.02  # volatility
        
        shock = np.random.normal(0, 1)
        self.btc_price *= np.exp(
            (mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * shock
        )
        
        # Keep price in reasonable range
        self.btc_price = max(self.btc_price, 20000)
        self.btc_price = min(self.btc_price, 150000)
        
        return round(self.btc_price, 2)
    
    def generate_electricity_price(self) -> float:
        """Generate time-based electricity prices (ERCOT-style)"""
        now = datetime.now()
        hour = now.hour
        
        base_price = self.electricity_price
        
        # Peak hours: 12pm-8pm have higher prices
        if 12 <= hour <= 20:
            # Peak pricing with random spikes
            price = base_price * random.uniform(1.5, 3.0)
            
            # 5% chance of extreme spike
            if random.random() < 0.05:
                price *= random.uniform(5, 10)
                logger.warning(f"⚡ PRICE SPIKE: ${price:.3f}/kWh")
        else:
            # Off-peak pricing
            price = base_price * random.uniform(0.7, 1.2)
        
        return round(price, 4)
    
    def generate_gpu_spot_rate(self) -> float:
        """Generate GPU spot pricing based on demand"""
        # Simulate demand fluctuations
        demand_multiplier = random.uniform(0.8, 1.5)
        
        # 10% chance of high demand period
        if random.random() < 0.1:
            demand_multiplier = random.uniform(2.0, 4.0)
            logger.info(f"🚀 HIGH DEMAND: GPU spot rate increased")
        
        rate = self.gpu_spot_rate * demand_multiplier
        return round(rate, 3)
    
    async def publish_price(self, price_data: PriceData):
        """Publish price data to Kafka"""
        price_dict = price_data.to_dict()
        
        logger.info(
            f"📊 {price_data.price_type.upper()}: "
            f"${price_data.value} {price_data.unit} "
            f"(source: {price_data.source})"
        )
        
        if self.producer:
            try:
                self.producer.send('price-data', value=price_dict)
            except Exception as e:
                logger.error(f"Failed to send price data: {e}")
    
    async def run_btc_price_feed(self):
        """Continuously generate BTC prices"""
        while True:
            price = self.generate_btc_price()
            
            price_data = PriceData(
                timestamp=datetime.utcnow().isoformat() + 'Z',
                price_type='btc',
                value=price,
                unit='USD',
                source='aggregate',
                metadata={'exchanges': ['coinbase', 'binance', 'kraken']}
            )
            
            await self.publish_price(price_data)
            await asyncio.sleep(10)  # Update every 10 seconds
    
    async def run_electricity_price_feed(self):
        """Continuously generate electricity prices"""
        while True:
            price = self.generate_electricity_price()
            
            price_data = PriceData(
                timestamp=datetime.utcnow().isoformat() + 'Z',
                price_type='electricity',
                value=price,
                unit='USD/kWh',
                source='ERCOT',
                region='Texas',
                metadata={'node': 'HB_HOUSTON'}
            )
            
            await self.publish_price(price_data)
            await asyncio.sleep(300)  # Update every 5 minutes
    
    async def run_gpu_spot_feed(self):
        """Continuously generate GPU spot rates"""
        while True:
            rate = self.generate_gpu_spot_rate()
            
            price_data = PriceData(
                timestamp=datetime.utcnow().isoformat() + 'Z',
                price_type='gpu_spot',
                value=rate,
                unit='USD/hour',
                source='market',
                metadata={'gpu_type': 'H100', 'region': 'us-east-1'}
            )
            
            await self.publish_price(price_data)
            await asyncio.sleep(60)  # Update every minute
    
    async def start(self):
        """Start all price feeds"""
        logger.info("Starting market data simulator...")
        
        await asyncio.gather(
            self.run_btc_price_feed(),
            self.run_electricity_price_feed(),
            self.run_gpu_spot_feed()
        )


async def main():
    """Main entry point"""
    simulator = MarketDataSimulator()
    await simulator.start()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Shutting down market data simulator...")

