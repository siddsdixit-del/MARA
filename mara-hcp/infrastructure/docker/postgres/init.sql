-- MARA HCP PostgreSQL Initialization Script
-- Operational Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    location JSONB NOT NULL,
    capacity_mw DECIMAL(10,2),
    pue DECIMAL(3,2),
    status VARCHAR(50) NOT NULL CHECK (status IN ('operational', 'maintenance', 'offline')),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_facilities_status ON facilities(status);
CREATE INDEX idx_facilities_location ON facilities USING GIN(location);

-- Resources Table (GPUs, ASICs, etc.)
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('GPU', 'ASIC', 'CPU', 'Network', 'Storage')),
    subtype VARCHAR(100),  -- H100, S21, etc.
    specifications JSONB,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'allocated', 'maintenance', 'failed', 'partial')),
    current_workload_id UUID,
    current_utilization DECIMAL(5,2) DEFAULT 0.0,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resources_facility ON resources(facility_id);
CREATE INDEX idx_resources_type_status ON resources(type, status);
CREATE INDEX idx_resources_current_workload ON resources(current_workload_id);
CREATE INDEX idx_resources_specifications ON resources USING GIN(specifications);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
    api_key_hash VARCHAR(255),
    monthly_budget DECIMAL(12,2),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_tier ON customers(tier);
CREATE INDEX idx_customers_status ON customers(status);

-- Workloads Table
CREATE TABLE IF NOT EXISTS workloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ai_inference_realtime', 'ai_inference_batch', 'bitcoin_mining', 'model_training', 'hyperparameter_tuning', 'data_processing')),
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 10),
    status VARCHAR(20) NOT NULL CHECK (status IN ('queued', 'scheduled', 'running', 'completed', 'failed', 'cancelled', 'paused')),
    requirements JSONB,
    sla_parameters JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cost DECIMAL(10,4),
    metadata JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workloads_customer ON workloads(customer_id);
CREATE INDEX idx_workloads_status ON workloads(status);
CREATE INDEX idx_workloads_type_status ON workloads(type, status);
CREATE INDEX idx_workloads_priority ON workloads(priority);
CREATE INDEX idx_workloads_created_at ON workloads(created_at);

-- Resource Allocations Table
CREATE TABLE IF NOT EXISTS allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workload_id UUID REFERENCES workloads(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    released_at TIMESTAMPTZ,
    usage_metrics JSONB,
    cost DECIMAL(10,4),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'released', 'failed'))
);

CREATE INDEX idx_allocations_workload ON allocations(workload_id);
CREATE INDEX idx_allocations_resource ON allocations(resource_id);
CREATE INDEX idx_active_allocations ON allocations(released_at) WHERE released_at IS NULL;
CREATE INDEX idx_allocations_status ON allocations(status);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    user_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply Updated At Triggers
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workloads_updated_at BEFORE UPDATE ON workloads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Sample Data for Development
INSERT INTO facilities (name, location, capacity_mw, pue, status) VALUES
    ('Texas-1', '{"city": "Dallas", "state": "TX", "country": "USA", "lat": 32.7767, "lon": -96.7970}', 15.0, 1.15, 'operational'),
    ('Texas-2', '{"city": "Austin", "state": "TX", "country": "USA", "lat": 30.2672, "lon": -97.7431}', 12.5, 1.18, 'operational'),
    ('Canada-1', '{"city": "Quebec City", "state": "QC", "country": "Canada", "lat": 46.8139, "lon": -71.2080}', 8.0, 1.12, 'operational')
ON CONFLICT (name) DO NOTHING;

INSERT INTO customers (name, email, tier, monthly_budget, status) VALUES
    ('Acme Corporation', 'admin@acme.com', 'enterprise', 50000.00, 'active'),
    ('TechCo Inc', 'admin@techco.com', 'enterprise', 75000.00, 'active'),
    ('StartupLabs', 'admin@startuplabs.com', 'pro', 10000.00, 'active')
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mara;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mara;

