"""
MARA HCP - ML Model: Demand Forecaster
Predicts future resource demand using time-series analysis
"""

import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DemandForecaster:
    """
    Time-series forecaster for resource demand
    In production: use PyTorch LSTM or Prophet
    """
    
    def __init__(self):
        self.model_version = "1.0.0"
        logger.info(f"Demand Forecaster initialized (v{self.model_version})")
    
    def forecast(self, historical_demand: List[float], periods: int = 7) -> Dict:
        """
        Forecast future demand
        
        Args:
            historical_demand: Historical demand data
            periods: Number of periods to forecast
        
        Returns:
            Forecast results
        """
        if len(historical_demand) < 3:
            logger.warning("Insufficient historical data for forecasting")
            return {"error": "insufficient_data"}
        
        # Simple trend-based forecast (in production: use LSTM/Prophet)
        recent_trend = np.mean(np.diff(historical_demand[-7:]))
        base_demand = historical_demand[-1]
        
        forecasts = []
        for i in range(1, periods + 1):
            forecast_value = base_demand + (recent_trend * i)
            # Add some realistic variance
            forecast_value += np.random.normal(0, forecast_value * 0.05)
            forecast_value = max(0, forecast_value)  # Can't be negative
            forecasts.append(round(forecast_value, 2))
        
        return {
            "model_version": self.model_version,
            "base_demand": base_demand,
            "trend": recent_trend,
            "forecasts": forecasts,
            "forecast_dates": [
                (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d")
                for i in range(1, periods + 1)
            ],
            "confidence_interval": {
                "lower": [f * 0.9 for f in forecasts],
                "upper": [f * 1.1 for f in forecasts]
            }
        }


# Demo
if __name__ == "__main__":
    forecaster = DemandForecaster()
    
    # Simulated historical GPU demand (hours per day)
    historical = [1200, 1250, 1180, 1300, 1350, 1320, 1400, 1450, 1500, 1480]
    
    result = forecaster.forecast(historical, periods=7)
    
    logger.info("\n📊 Demand Forecast Results:")
    logger.info(f"Base Demand: {result['base_demand']} GPU-hours")
    logger.info(f"Trend: {result['trend']:.2f} GPU-hours/day")
    logger.info("\n7-Day Forecast:")
    for date, forecast in zip(result['forecast_dates'], result['forecasts']):
        logger.info(f"  {date}: {forecast} GPU-hours")

