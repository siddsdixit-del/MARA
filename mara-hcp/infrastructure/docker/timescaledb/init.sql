-- MARA HCP TimescaleDB Initialization Script
-- Time-Series Database for Metrics

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Metrics Table
CREATE TABLE IF NOT EXISTS metrics (
    time TIMESTAMPTZ NOT NULL,
    resource_id UUID NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DOUBLE PRECISION,
    tags JSONB,
    PRIMARY KEY (resource_id, time, metric_name)
);

-- Convert to hypertable (time-series optimization)
SELECT create_hypertable('metrics', 'time', if_not_exists => TRUE, chunk_time_interval => INTERVAL '1 hour');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_metrics_resource_time ON metrics (resource_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_name ON metrics (metric_name, time DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_tags ON metrics USING GIN (tags);

-- Create continuous aggregates for performance
CREATE MATERIALIZED VIEW IF NOT EXISTS metrics_1min
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 minute', time) AS bucket,
    resource_id,
    metric_name,
    AVG(value) as avg_value,
    MAX(value) as max_value,
    MIN(value) as min_value,
    COUNT(*) as count
FROM metrics
GROUP BY bucket, resource_id, metric_name
WITH NO DATA;

CREATE MATERIALIZED VIEW IF NOT EXISTS metrics_5min
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('5 minutes', time) AS bucket,
    resource_id,
    metric_name,
    AVG(value) as avg_value,
    MAX(value) as max_value,
    MIN(value) as min_value,
    COUNT(*) as count
FROM metrics
GROUP BY bucket, resource_id, metric_name
WITH NO DATA;

CREATE MATERIALIZED VIEW IF NOT EXISTS metrics_1hour
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 hour', time) AS bucket,
    resource_id,
    metric_name,
    AVG(value) as avg_value,
    MAX(value) as max_value,
    MIN(value) as min_value,
    COUNT(*) as count
FROM metrics
GROUP BY bucket, resource_id, metric_name
WITH NO DATA;

-- Add refresh policies
SELECT add_continuous_aggregate_policy('metrics_1min',
    start_offset => INTERVAL '1 hour',
    end_offset => INTERVAL '1 minute',
    schedule_interval => INTERVAL '1 minute',
    if_not_exists => TRUE);

SELECT add_continuous_aggregate_policy('metrics_5min',
    start_offset => INTERVAL '6 hours',
    end_offset => INTERVAL '5 minutes',
    schedule_interval => INTERVAL '5 minutes',
    if_not_exists => TRUE);

SELECT add_continuous_aggregate_policy('metrics_1hour',
    start_offset => INTERVAL '1 day',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour',
    if_not_exists => TRUE);

-- Price Data Table
CREATE TABLE IF NOT EXISTS price_data (
    time TIMESTAMPTZ NOT NULL,
    price_type VARCHAR(50) NOT NULL,  -- electricity, btc, gpu_spot
    value DECIMAL(15,6) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    source VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    metadata JSONB
);

SELECT create_hypertable('price_data', 'time', if_not_exists => TRUE, chunk_time_interval => INTERVAL '1 day');

CREATE INDEX IF NOT EXISTS idx_price_data_type_time ON price_data(price_type, time DESC);
CREATE INDEX IF NOT EXISTS idx_price_data_source ON price_data(source, time DESC);

-- Profitability Scores Table
CREATE TABLE IF NOT EXISTS profitability_scores (
    time TIMESTAMPTZ NOT NULL,
    resource_id UUID NOT NULL,
    workload_type VARCHAR(50) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    expected_revenue DECIMAL(10,4),
    estimated_cost DECIMAL(10,4),
    net_profit DECIMAL(10,4),
    confidence DECIMAL(3,2),
    recommendation VARCHAR(20),
    PRIMARY KEY (resource_id, time, workload_type)
);

SELECT create_hypertable('profitability_scores', 'time', if_not_exists => TRUE, chunk_time_interval => INTERVAL '1 day');

CREATE INDEX IF NOT EXISTS idx_profitability_resource_time ON profitability_scores(resource_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_profitability_recommendation ON profitability_scores(recommendation, time DESC);

-- Allocation History for Backtesting
CREATE TABLE IF NOT EXISTS allocation_history (
    time TIMESTAMPTZ NOT NULL,
    facility_id UUID NOT NULL,
    resource_id UUID NOT NULL,
    resource_type VARCHAR(20) NOT NULL,
    recommended_workload VARCHAR(50),
    actual_workload VARCHAR(50),
    expected_profit DECIMAL(10,4),
    actual_profit DECIMAL(10,4)
);

SELECT create_hypertable('allocation_history', 'time', if_not_exists => TRUE, chunk_time_interval => INTERVAL '1 day');

CREATE INDEX IF NOT EXISTS idx_allocation_history_facility ON allocation_history(facility_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_allocation_history_resource ON allocation_history(resource_id, time DESC);

-- Data Retention Policies
SELECT add_retention_policy('metrics', INTERVAL '30 days', if_not_exists => TRUE);
SELECT add_retention_policy('price_data', INTERVAL '90 days', if_not_exists => TRUE);
SELECT add_retention_policy('profitability_scores', INTERVAL '90 days', if_not_exists => TRUE);
SELECT add_retention_policy('allocation_history', INTERVAL '180 days', if_not_exists => TRUE);

-- Compression Policies
SELECT add_compression_policy('metrics', INTERVAL '7 days', if_not_exists => TRUE);
SELECT add_compression_policy('price_data', INTERVAL '7 days', if_not_exists => TRUE);
SELECT add_compression_policy('profitability_scores', INTERVAL '14 days', if_not_exists => TRUE);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mara;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mara;

