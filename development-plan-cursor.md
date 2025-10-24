# MARA Hybrid Compute Platform - Comprehensive Development Plan

**Version**: 1.0  
**Date**: October 2025  
**Project**: MARA Hybrid Compute Platform (HCP)  
**Architecture**: Microservices with Event-Driven Architecture  
**Development Approach**: Agile with 2-week sprints

---

## Executive Summary

This development plan outlines a comprehensive, sprint-by-sprint approach to building the MARA Hybrid Compute Platform - a cloud-native orchestration system that dynamically allocates computational resources between Bitcoin mining and AI inference workloads based on real-time economic signals.

**Key Objectives:**
- Build a fully functional platform capable of managing 50,000+ GPUs and 250,000+ ASICs
- Enable sub-100ms workload switching between Bitcoin mining and AI inference
- Achieve 99.99% uptime and <50ms API latency (p50)
- Implement SOC 2 Type II and ISO 27001 compliance
- Create comprehensive simulation environment for local development and testing
- Establish automated QA, security scanning, and DevOps pipelines

**Total Timeline**: 30 sprints (60 weeks / ~15 months)

---

## 1. Technology Stack & Architecture Decisions

### 1.1 Core Technology Stack

#### Backend Services
- **Languages**: 
  - Go 1.21+ (core orchestration services, high-performance components)
  - Python 3.12+ (ML/AI services, data processing)
  - Rust 1.75+ (system-level components, resource controllers)
- **API Framework**: 
  - gRPC with Protocol Buffers (internal service-to-service)
  - REST with OpenAPI 3.0 (external customer-facing APIs)
  - GraphQL (flexible data queries for dashboards)

#### Frontend
- **Framework**: React 18+ with TypeScript 5+
- **UI Library**: Material-UI v5 with custom MARA theme
- **State Management**: Redux Toolkit + RTK Query
- **Visualization**: D3.js, Recharts, Apache ECharts
- **Build Tools**: Vite, ESBuild

#### Data Layer
- **Operational Database**: PostgreSQL 15 (primary OLTP)
- **Time-Series Database**: TimescaleDB (metrics, telemetry)
- **Cache Layer**: Redis 7.2 Cluster (distributed cache, session management)
- **Document Store**: MongoDB 7.0 (audit logs, unstructured data)
- **Graph Database**: Neo4j 5.0 (resource relationships, network topology)
- **Message Queue**: Apache Kafka 3.5 (event streaming, workload orchestration)
- **Task Queue**: Celery 5.3 with Redis backend

#### Infrastructure & DevOps
- **Container Runtime**: Docker 24+
- **Orchestration**: Kubernetes 1.28+ (k3s for local development)
- **Service Mesh**: Istio 1.19 (traffic management, security)
- **Infrastructure as Code**: Terraform 1.5+, Helm 3.12+
- **CI/CD**: GitLab CI / GitHub Actions + ArgoCD
- **Container Registry**: Harbor (self-hosted) or Docker Hub

#### Monitoring & Observability
- **Metrics**: Prometheus + Thanos (long-term storage)
- **Logging**: Elasticsearch + Fluentd + Kibana (EFK stack)
- **Tracing**: Jaeger with OpenTelemetry
- **APM**: DataDog or Grafana Cloud
- **Alerting**: Prometheus Alertmanager + PagerDuty

#### ML/AI Stack
- **Frameworks**: TensorFlow 2.14+, PyTorch 2.1+
- **Training**: Kubeflow, MLflow
- **Serving**: TensorFlow Serving, TorchServe, NVIDIA Triton
- **Feature Store**: Feast
- **Experiment Tracking**: MLflow, Weights & Biases

#### Security & Compliance
- **Secret Management**: HashiCorp Vault
- **Identity Provider**: Keycloak (OAuth 2.0/OIDC)
- **API Gateway**: Kong Gateway with rate limiting
- **WAF**: ModSecurity, OWASP Core Rule Set
- **Security Scanning**: Trivy, Snyk, SonarQube
- **Compliance**: OpenSCAP, InSpec

### 1.2 Simulation Environment

To enable local development and testing without physical hardware, we'll build comprehensive simulators:

#### Hardware Simulators
- **GPU Simulator**: Mock NVIDIA H100 GPUs with realistic metrics (utilization, memory, temperature, power)
- **ASIC Simulator**: Mock Bitcoin mining ASICs with hash rate, efficiency, temperature
- **Network Simulator**: Mock network latency, bandwidth, packet loss using tc (traffic control)
- **Power Simulator**: Mock power consumption, PDU controls, grid interactions
- **Cooling Simulator**: Mock temperature sensors, cooling systems, thermal dynamics

#### External System Simulators
- **Market Data Simulator**: Mock real-time price feeds (electricity, GPU rates, BTC price)
- **ERCOT Grid Simulator**: Mock grid demand response signals
- **Mining Pool Simulator**: Mock Stratum V2 protocol, pool responses
- **Cloud Provider Simulator**: Mock AWS/Azure/GCP APIs for hybrid cloud

#### Data Generation
- **Workload Generator**: Generate realistic AI inference and Bitcoin mining workloads
- **Event Generator**: Generate system events, alerts, failures for testing resilience
- **Load Testing**: Generate high-volume traffic to test scalability

---

## 2. Development Phases Overview

### Phase 1: Foundation & Infrastructure (Sprints 0-5)
- Project setup, infrastructure, core services, simulation framework

### Phase 2: Core Platform Services (Sprints 6-12)
- Economic optimization, workload routing, resource management

### Phase 3: Customer-Facing Features (Sprints 13-16)
- Web portal, REST API, SDKs, billing

### Phase 4: Advanced Features & ML (Sprints 17-20)
- Predictive models, anomaly detection, capacity planning

### Phase 5: Security, Compliance & QA (Sprints 21-24)
- Security hardening, compliance certifications, automated testing

### Phase 6: DevOps, Performance & Scale (Sprints 25-28)
- CI/CD pipelines, performance optimization, load testing

### Phase 7: Integration & Production Readiness (Sprints 29-30)
- End-to-end integration, production deployment, documentation

---

## 3. Detailed Sprint Plan

---

### **SPRINT 0: Project Foundation & Development Environment**
**Duration**: 2 weeks  
**Team**: Full team (Platform, DevOps, Frontend, Backend)

#### Objectives
- Establish project structure and repositories
- Set up local development environment
- Configure core infrastructure services
- Establish coding standards and workflows

#### Tasks

**1. Repository Structure & Version Control**
- [ ] Create monorepo structure with the following layout:
  ```
  mara-hcp/
  ├── services/           # Backend microservices
  │   ├── api-gateway/   # Kong gateway configuration
  │   ├── orchestrator/  # Core orchestration engine (Go)
  │   ├── optimizer/     # Economic optimizer (Go + Python)
  │   ├── workload-router/ # Workload routing service (Go)
  │   ├── resource-manager/ # Resource management (Rust)
  │   ├── billing/       # Billing and metering (Go)
  │   └── ml-services/   # ML model serving (Python)
  ├── web/               # Frontend applications
  │   ├── portal/        # Customer web portal (React)
  │   └── admin/         # Admin dashboard (React)
  ├── simulators/        # Hardware and system simulators
  │   ├── gpu-sim/       # GPU simulator (Python)
  │   ├── asic-sim/      # ASIC simulator (Python)
  │   ├── market-sim/    # Market data simulator (Python)
  │   └── grid-sim/      # Grid simulator (Python)
  ├── infrastructure/    # IaC and deployment
  │   ├── terraform/     # Terraform modules
  │   ├── kubernetes/    # K8s manifests and Helm charts
  │   └── docker/        # Dockerfiles
  ├── scripts/           # Utility scripts
  ├── docs/              # Documentation
  └── tests/             # Integration and E2E tests
  ```
- [ ] Initialize Git with proper .gitignore files
- [ ] Set up branch protection rules (main, develop, feature/*, release/*)
- [ ] Configure Git LFS for large files (ML models, datasets)

**2. Development Tools & IDE Configuration**
- [ ] Create VS Code workspace with recommended extensions
  - Go extension
  - Python extension
  - Rust Analyzer
  - Docker extension
  - Kubernetes extension
  - GitLens
  - ESLint, Prettier
- [ ] Configure EditorConfig for consistent formatting
- [ ] Set up pre-commit hooks with Husky
  - Linting (golangci-lint, pylint, ESLint)
  - Format checking (gofmt, black, prettier)
  - Security scanning (gitleaks for secrets)

**3. Local Development Infrastructure (Docker Compose)**
- [ ] Create `docker-compose.yml` for local development:
  ```yaml
  services:
    # Databases
    postgres:
      image: postgres:15
      environment:
        POSTGRES_DB: mara_hcp
        POSTGRES_USER: mara
        POSTGRES_PASSWORD: dev_password
      ports:
        - "5432:5432"
      volumes:
        - postgres_data:/var/lib/postgresql/data
    
    timescaledb:
      image: timescale/timescaledb:latest-pg15
      environment:
        POSTGRES_DB: mara_metrics
        POSTGRES_USER: mara
        POSTGRES_PASSWORD: dev_password
      ports:
        - "5433:5432"
      volumes:
        - timescale_data:/var/lib/postgresql/data
    
    redis:
      image: redis:7.2-alpine
      ports:
        - "6379:6379"
      volumes:
        - redis_data:/data
    
    mongodb:
      image: mongo:7.0
      environment:
        MONGO_INITDB_ROOT_USERNAME: mara
        MONGO_INITDB_ROOT_PASSWORD: dev_password
      ports:
        - "27017:27017"
      volumes:
        - mongo_data:/data/db
    
    neo4j:
      image: neo4j:5.0
      environment:
        NEO4J_AUTH: neo4j/dev_password
      ports:
        - "7474:7474"  # HTTP
        - "7687:7687"  # Bolt
      volumes:
        - neo4j_data:/data
    
    # Message Queue
    zookeeper:
      image: confluentinc/cp-zookeeper:latest
      environment:
        ZOOKEEPER_CLIENT_PORT: 2181
    
    kafka:
      image: confluentinc/cp-kafka:latest
      depends_on:
        - zookeeper
      environment:
        KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
        KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      ports:
        - "9092:9092"
    
    # Monitoring
    prometheus:
      image: prom/prometheus:latest
      ports:
        - "9090:9090"
      volumes:
        - ./infrastructure/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
        - prometheus_data:/prometheus
    
    grafana:
      image: grafana/grafana:latest
      ports:
        - "3000:3000"
      environment:
        GF_SECURITY_ADMIN_PASSWORD: admin
      volumes:
        - grafana_data:/var/lib/grafana
    
    # Service Mesh & API Gateway
    kong:
      image: kong:latest
      environment:
        KONG_DATABASE: "off"
        KONG_PROXY_ACCESS_LOG: /dev/stdout
        KONG_ADMIN_ACCESS_LOG: /dev/stdout
        KONG_PROXY_ERROR_LOG: /dev/stderr
        KONG_ADMIN_ERROR_LOG: /dev/stderr
        KONG_ADMIN_LISTEN: 0.0.0.0:8001
      ports:
        - "8000:8000"  # Proxy
        - "8001:8001"  # Admin API
    
    # Vault for secrets
    vault:
      image: vault:latest
      environment:
        VAULT_DEV_ROOT_TOKEN_ID: dev-token
      ports:
        - "8200:8200"
      cap_add:
        - IPC_LOCK
    
  volumes:
    postgres_data:
    timescale_data:
    redis_data:
    mongo_data:
    neo4j_data:
    prometheus_data:
    grafana_data:
  ```

**4. Database Schema & Migrations**
- [ ] Set up database migration tools:
  - PostgreSQL: golang-migrate or goose
  - MongoDB: mongomigrate
- [ ] Create initial database schemas:
  ```sql
  -- PostgreSQL Schema
  
  -- Facilities
  CREATE TABLE facilities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      location JSONB NOT NULL,
      capacity_mw DECIMAL(10,2),
      pue DECIMAL(3,2),
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  -- Resources
  CREATE TABLE resources (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      facility_id UUID REFERENCES facilities(id),
      type VARCHAR(20) NOT NULL, -- GPU, ASIC, CPU
      subtype VARCHAR(100), -- H100, S21, etc.
      specifications JSONB,
      status VARCHAR(20) NOT NULL, -- available, allocated, maintenance, failed
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  CREATE INDEX idx_resources_facility ON resources(facility_id);
  CREATE INDEX idx_resources_type_status ON resources(type, status);
  
  -- Customers
  CREATE TABLE customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      tier VARCHAR(50) NOT NULL, -- free, pro, enterprise
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  -- Workloads
  CREATE TABLE workloads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID REFERENCES customers(id),
      type VARCHAR(50) NOT NULL, -- ai_inference_realtime, ai_inference_batch, bitcoin_mining, model_training
      priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 10),
      status VARCHAR(20) NOT NULL, -- queued, scheduled, running, completed, failed, cancelled
      requirements JSONB,
      sla_parameters JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      cost DECIMAL(10,4)
  );
  
  CREATE INDEX idx_workloads_customer ON workloads(customer_id);
  CREATE INDEX idx_workloads_status ON workloads(status);
  CREATE INDEX idx_workloads_type_status ON workloads(type, status);
  
  -- Resource Allocations
  CREATE TABLE allocations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      workload_id UUID REFERENCES workloads(id),
      resource_id UUID REFERENCES resources(id),
      allocated_at TIMESTAMPTZ DEFAULT NOW(),
      released_at TIMESTAMPTZ,
      usage_metrics JSONB,
      cost DECIMAL(10,4)
  );
  
  CREATE INDEX idx_allocations_workload ON allocations(workload_id);
  CREATE INDEX idx_allocations_resource ON allocations(resource_id);
  CREATE INDEX idx_active_allocations ON allocations(released_at) WHERE released_at IS NULL;
  
  -- TimescaleDB for metrics
  CREATE TABLE metrics (
      time TIMESTAMPTZ NOT NULL,
      resource_id UUID NOT NULL,
      metric_name VARCHAR(100) NOT NULL,
      value DOUBLE PRECISION,
      tags JSONB,
      PRIMARY KEY (resource_id, time, metric_name)
  );
  
  SELECT create_hypertable('metrics', 'time', chunk_time_interval => INTERVAL '1 hour');
  
  -- Create continuous aggregates for performance
  CREATE MATERIALIZED VIEW metrics_1min
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
  GROUP BY bucket, resource_id, metric_name;
  ```

**5. Coding Standards & Documentation**
- [ ] Create comprehensive coding standards documents:
  - Go: Follow Google Go Style Guide
  - Python: PEP 8 with type hints
  - TypeScript: Airbnb JavaScript Style Guide
  - Rust: Official Rust style guide
- [ ] Set up API documentation:
  - OpenAPI 3.0 specs for REST APIs
  - Proto documentation for gRPC services
- [ ] Create Architecture Decision Records (ADR) template
- [ ] Initialize project wiki with:
  - Getting started guide
  - Architecture overview
  - Development workflow
  - Troubleshooting guide

**6. CI/CD Foundation**
- [ ] Create `.gitlab-ci.yml` or `.github/workflows/main.yml`:
  ```yaml
  name: CI Pipeline
  
  on:
    push:
      branches: [ main, develop ]
    pull_request:
      branches: [ main, develop ]
  
  jobs:
    lint:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Lint Go services
          run: make lint-go
        - name: Lint Python services
          run: make lint-python
        - name: Lint Frontend
          run: make lint-frontend
    
    test:
      runs-on: ubuntu-latest
      needs: lint
      steps:
        - uses: actions/checkout@v3
        - name: Run unit tests
          run: make test-unit
        - name: Upload coverage
          uses: codecov/codecov-action@v3
    
    build:
      runs-on: ubuntu-latest
      needs: test
      steps:
        - uses: actions/checkout@v3
        - name: Build Docker images
          run: make build-images
        - name: Push to registry
          run: make push-images
  ```

**7. Makefile for Common Operations**
- [ ] Create comprehensive Makefile:
  ```makefile
  .PHONY: help setup start stop test lint build clean
  
  help: ## Show this help
  	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
  
  setup: ## Setup development environment
  	@echo "Setting up development environment..."
  	docker-compose up -d
  	sleep 10
  	make migrate
  	@echo "Development environment ready!"
  
  start: ## Start all services
  	docker-compose up -d
  
  stop: ## Stop all services
  	docker-compose down
  
  migrate: ## Run database migrations
  	cd services/orchestrator && migrate -path ./migrations -database "postgresql://mara:dev_password@localhost:5432/mara_hcp?sslmode=disable" up
  
  test-unit: ## Run unit tests
  	@echo "Running Go tests..."
  	cd services && go test ./... -v -cover
  	@echo "Running Python tests..."
  	cd simulators && pytest -v
  	@echo "Running frontend tests..."
  	cd web/portal && npm test
  
  lint-go: ## Lint Go code
  	golangci-lint run ./services/...
  
  lint-python: ## Lint Python code
  	cd simulators && pylint **/*.py
  	cd simulators && black --check .
  	cd simulators && mypy .
  
  lint-frontend: ## Lint frontend code
  	cd web/portal && npm run lint
  
  build-images: ## Build Docker images
  	docker build -t mara-hcp/orchestrator:latest services/orchestrator
  	docker build -t mara-hcp/optimizer:latest services/optimizer
  	# ... other services
  
  clean: ## Clean up
  	docker-compose down -v
  	find . -name "*.pyc" -delete
  	find . -name "__pycache__" -delete
  ```

#### Deliverables
- [ ] Complete monorepo structure with all directories
- [ ] Working local development environment with docker-compose
- [ ] Database schemas and migration scripts
- [ ] Coding standards documentation
- [ ] CI/CD pipeline configuration
- [ ] Comprehensive README and development guide

#### Success Criteria
- ✅ All team members can successfully run `make setup` and get a working local environment
- ✅ All databases are accessible and schemas are initialized
- ✅ CI pipeline runs successfully on sample code
- ✅ Documentation is clear and comprehensive

---

### **SPRINT 1: Core Infrastructure Services & Simulators Foundation**
**Duration**: 2 weeks  
**Team**: Backend (Go/Rust), Platform (Python), DevOps

#### Objectives
- Build foundational microservices skeleton
- Create hardware simulation framework
- Establish service-to-service communication
- Implement basic observability

#### Tasks

**1. API Gateway Service (Kong Configuration)**
- [ ] Configure Kong Gateway with declarative configuration:
  ```yaml
  _format_version: "3.0"
  
  services:
    - name: orchestrator-service
      url: http://orchestrator:8080
      routes:
        - name: orchestrator-route
          paths:
            - /api/v1/orchestrator
      plugins:
        - name: rate-limiting
          config:
            minute: 1000
            policy: local
        - name: jwt
        - name: cors
  
    - name: optimizer-service
      url: http://optimizer:8081
      routes:
        - name: optimizer-route
          paths:
            - /api/v1/optimizer
  ```
- [ ] Implement authentication plugin with JWT validation
- [ ] Configure rate limiting per customer tier
- [ ] Set up request/response logging
- [ ] Add health check endpoints

**2. Service Discovery with Consul**
- [ ] Deploy Consul for service discovery
- [ ] Configure service registration:
  ```json
  {
    "service": {
      "name": "orchestrator",
      "port": 8080,
      "checks": [
        {
          "http": "http://localhost:8080/health",
          "interval": "10s"
        }
      ]
    }
  }
  ```
- [ ] Implement health checks for all services
- [ ] Configure DNS resolution

**3. Core Orchestrator Service (Go)**
- [ ] Create microservice skeleton with:
  ```go
  package main
  
  import (
      "context"
      "log"
      "net/http"
      
      "github.com/gin-gonic/gin"
      "github.com/prometheus/client_golang/prometheus/promhttp"
      "google.golang.org/grpc"
  )
  
  type OrchestratorService struct {
      config     *Config
      httpServer *http.Server
      grpcServer *grpc.Server
  }
  
  func main() {
      svc := NewOrchestratorService()
      
      // Start HTTP server for REST API
      go svc.StartHTTP(":8080")
      
      // Start gRPC server for internal communication
      go svc.StartGRPC(":9090")
      
      // Graceful shutdown
      svc.WaitForShutdown()
  }
  ```
- [ ] Implement gRPC service definitions:
  ```protobuf
  syntax = "proto3";
  
  package mara.orchestrator.v1;
  
  service OrchestratorService {
      rpc AllocateResources(AllocationRequest) returns (AllocationResponse);
      rpc ReleaseResources(ReleaseRequest) returns (ReleaseResponse);
      rpc GetResourceStatus(ResourceStatusRequest) returns (ResourceStatusResponse);
  }
  
  message AllocationRequest {
      string workload_id = 1;
      ResourceRequirements requirements = 2;
  }
  
  message ResourceRequirements {
      string resource_type = 1;
      int32 count = 2;
      map<string, string> specifications = 3;
  }
  ```
- [ ] Add Prometheus metrics:
  ```go
  var (
      allocationsTotal = prometheus.NewCounterVec(
          prometheus.CounterOpts{
              Name: "orchestrator_allocations_total",
              Help: "Total number of resource allocations",
          },
          []string{"resource_type", "status"},
      )
      
      allocationDuration = prometheus.NewHistogramVec(
          prometheus.HistogramOpts{
              Name: "orchestrator_allocation_duration_seconds",
              Help: "Duration of allocation operations",
          },
          []string{"resource_type"},
      )
  )
  ```
- [ ] Implement structured logging with zap
- [ ] Add OpenTelemetry tracing

**4. GPU Simulator (Python)**
- [ ] Create GPU simulator with realistic behavior:
  ```python
  import asyncio
  import random
  from dataclasses import dataclass
  from typing import Dict, Optional
  
  @dataclass
  class GPUMetrics:
      utilization: float  # 0-100%
      memory_used: int    # MB
      memory_total: int   # MB
      temperature: float  # Celsius
      power_draw: float   # Watts
      clock_speed: int    # MHz
  
  class GPUSimulator:
      """Simulates NVIDIA H100 GPU behavior"""
      
      def __init__(self, gpu_id: str, model: str = "H100"):
          self.gpu_id = gpu_id
          self.model = model
          self.memory_total = 80 * 1024  # 80GB in MB
          self.max_power = 700  # Watts
          self.base_temp = 45.0  # Celsius
          self.current_workload: Optional[str] = None
          self.is_running = False
      
      async def start(self):
          """Start the GPU simulator"""
          self.is_running = True
          asyncio.create_task(self._simulate_metrics())
      
      async def _simulate_metrics(self):
          """Continuously simulate GPU metrics"""
          while self.is_running:
              metrics = self._generate_metrics()
              await self._publish_metrics(metrics)
              await asyncio.sleep(1)  # Update every second
      
      def _generate_metrics(self) -> GPUMetrics:
          """Generate realistic GPU metrics based on workload"""
          if self.current_workload:
              # High utilization when running workload
              utilization = random.uniform(85, 99)
              memory_used = int(self.memory_total * random.uniform(0.7, 0.95))
              power_draw = self.max_power * random.uniform(0.8, 0.98)
              temp_increase = random.uniform(15, 25)
          else:
              # Idle state
              utilization = random.uniform(0, 5)
              memory_used = int(self.memory_total * 0.05)
              power_draw = self.max_power * 0.15
              temp_increase = 0
          
          return GPUMetrics(
              utilization=utilization,
              memory_used=memory_used,
              memory_total=self.memory_total,
              temperature=self.base_temp + temp_increase,
              power_draw=power_draw,
              clock_speed=1980 if self.current_workload else 1000
          )
      
      async def _publish_metrics(self, metrics: GPUMetrics):
          """Publish metrics to Kafka"""
          # Implementation in next section
          pass
      
      def assign_workload(self, workload_id: str):
          """Assign a workload to this GPU"""
          self.current_workload = workload_id
      
      def release_workload(self):
          """Release the current workload"""
          self.current_workload = None
  ```

**5. ASIC Simulator (Python)**
- [ ] Create ASIC simulator for Bitcoin mining:
  ```python
  @dataclass
  class ASICMetrics:
      hash_rate: float      # TH/s
      efficiency: float     # J/TH
      temperature: float    # Celsius
      power_draw: float     # Watts
      hardware_errors: int  # Count
      accepted_shares: int  # Count
      rejected_shares: int  # Count
  
  class ASICSimulator:
      """Simulates Antminer S21 ASIC behavior"""
      
      def __init__(self, asic_id: str, model: str = "S21"):
          self.asic_id = asic_id
          self.model = model
          self.max_hash_rate = 270  # TH/s
          self.efficiency = 13.5  # J/TH
          self.base_temp = 35.0
          self.is_mining = False
      
      def _generate_metrics(self) -> ASICMetrics:
          """Generate realistic ASIC metrics"""
          if self.is_mining:
              hash_rate = self.max_hash_rate * random.uniform(0.95, 1.0)
              power_draw = hash_rate * self.efficiency
              temp = self.base_temp + random.uniform(20, 35)
              hardware_errors = random.randint(0, 2)
          else:
              hash_rate = 0
              power_draw = 50  # Idle power
              temp = self.base_temp
              hardware_errors = 0
          
          return ASICMetrics(
              hash_rate=hash_rate,
              efficiency=self.efficiency,
              temperature=temp,
              power_draw=power_draw,
              hardware_errors=hardware_errors,
              accepted_shares=random.randint(0, 100) if self.is_mining else 0,
              rejected_shares=random.randint(0, 2) if self.is_mining else 0
          )
  ```

**6. Market Data Simulator (Python)**
- [ ] Create realistic market data generator:
  ```python
  import numpy as np
  from datetime import datetime, timedelta
  
  class MarketDataSimulator:
      """Simulates market data for optimization decisions"""
      
      def __init__(self):
          self.btc_price = 65000.0  # Starting BTC price
          self.electricity_price = 0.04  # $/kWh
          self.gpu_spot_rate = 2.50  # $/GPU-hour
      
      def generate_btc_price(self) -> float:
          """Generate realistic BTC price with volatility"""
          # Use Geometric Brownian Motion
          dt = 1/24  # hourly
          mu = 0.0001  # drift
          sigma = 0.02  # volatility
          
          shock = np.random.normal(0, 1)
          self.btc_price *= np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * shock)
          return max(self.btc_price, 20000)  # Floor price
      
      def generate_electricity_price(self, hour: int) -> float:
          """Generate time-based electricity prices"""
          # Peak hours: 12pm-8pm have higher prices
          base_price = self.electricity_price
          
          if 12 <= hour <= 20:
              # Peak pricing with random spikes
              price = base_price * random.uniform(1.5, 3.0)
              if random.random() < 0.05:  # 5% chance of extreme spike
                  price *= random.uniform(5, 10)
          else:
              # Off-peak pricing
              price = base_price * random.uniform(0.7, 1.2)
          
          return price
      
      def generate_gpu_spot_rate(self) -> float:
          """Generate GPU spot pricing based on demand"""
          # Simulate demand fluctuations
          demand_multiplier = random.uniform(0.8, 1.5)
          if random.random() < 0.1:  # 10% chance of high demand
              demand_multiplier = random.uniform(2.0, 4.0)
          
          return self.gpu_spot_rate * demand_multiplier
  ```

**7. Metrics Collection Pipeline**
- [ ] Implement Kafka producer for simulators:
  ```python
  from kafka import KafkaProducer
  import json
  
  class MetricsPublisher:
      def __init__(self, kafka_brokers: list):
          self.producer = KafkaProducer(
              bootstrap_servers=kafka_brokers,
              value_serializer=lambda v: json.dumps(v).encode('utf-8')
          )
      
      async def publish_gpu_metrics(self, gpu_id: str, metrics: GPUMetrics):
          topic = "gpu-metrics"
          message = {
              "timestamp": datetime.utcnow().isoformat(),
              "gpu_id": gpu_id,
              "metrics": metrics.__dict__
          }
          self.producer.send(topic, value=message)
      
      async def publish_asic_metrics(self, asic_id: str, metrics: ASICMetrics):
          topic = "asic-metrics"
          message = {
              "timestamp": datetime.utcnow().isoformat(),
              "asic_id": asic_id,
              "metrics": metrics.__dict__
          }
          self.producer.send(topic, value=message)
  ```

**8. Metrics Consumer Service (Go)**
- [ ] Create metrics consumer to store in TimescaleDB:
  ```go
  package main
  
  import (
      "context"
      "encoding/json"
      
      "github.com/segmentio/kafka-go"
      "github.com/jackc/pgx/v5/pgxpool"
  )
  
  type MetricsConsumer struct {
      reader *kafka.Reader
      db     *pgxpool.Pool
  }
  
  func (mc *MetricsConsumer) Start(ctx context.Context) error {
      for {
          msg, err := mc.reader.FetchMessage(ctx)
          if err != nil {
              return err
          }
          
          if err := mc.processMessage(ctx, msg); err != nil {
              log.Printf("Error processing message: %v", err)
              continue
          }
          
          mc.reader.CommitMessages(ctx, msg)
      }
  }
  
  func (mc *MetricsConsumer) processMessage(ctx context.Context, msg kafka.Message) error {
      var metric map[string]interface{}
      if err := json.Unmarshal(msg.Value, &metric); err != nil {
          return err
      }
      
      query := `
          INSERT INTO metrics (time, resource_id, metric_name, value, tags)
          VALUES ($1, $2, $3, $4, $5)
      `
      
      // Extract and store metrics
      // Implementation details...
      
      return nil
  }
  ```

#### Deliverables
- [ ] Working API Gateway with routing and authentication
- [ ] Core orchestrator service skeleton
- [ ] GPU and ASIC simulators generating realistic metrics
- [ ] Market data simulator
- [ ] Metrics collection pipeline (Kafka → TimescaleDB)
- [ ] Basic observability (Prometheus metrics, logs)

#### Success Criteria
- ✅ Simulators generate 1000+ GPU and 5000+ ASIC instances
- ✅ Metrics are published to Kafka at 1Hz frequency
- ✅ Metrics are stored in TimescaleDB with <100ms latency
- ✅ API Gateway successfully routes requests to services
- ✅ Services can discover each other via Consul
- ✅ Prometheus scrapes metrics from all services

---

### **SPRINT 2: Economic Optimization Engine - Data Ingestion & Storage**
**Duration**: 2 weeks  
**Team**: Backend (Go), ML/Data (Python)

#### Objectives
- Implement real-time price data ingestion
- Build profitability calculation engine
- Create historical data storage and retrieval
- Establish data pipeline for optimization decisions

#### Tasks

**1. Price Data Ingestion Service (Go)**
- [ ] Create price ingestion service:
  ```go
  package priceingestion
  
  type PriceIngestionService struct {
      ercotClient      *ERCOTClient
      cryptoExchanges  []CryptoExchange
      cloudProviders   []CloudProvider
      publisher        *kafka.Producer
      cache            *redis.Client
  }
  
  // Ingest electricity prices from ERCOT (simulated)
  func (p *PriceIngestionService) IngestElectricityPrices(ctx context.Context) error {
      ticker := time.NewTicker(5 * time.Minute)
      defer ticker.Stop()
      
      for {
          select {
          case <-ctx.Done():
              return nil
          case <-ticker.C:
              price, err := p.ercotClient.GetRealTimePrice()
              if err != nil {
                  log.Printf("Error fetching electricity price: %v", err)
                  continue
              }
              
              priceData := PriceData{
                  Timestamp:   time.Now(),
                  PriceType:   "electricity",
                  Value:       price,
                  Unit:        "USD/kWh",
                  Source:      "ERCOT",
                  Region:      "Texas",
              }
              
              // Publish to Kafka
              if err := p.publishPrice(priceData); err != nil {
                  log.Printf("Error publishing price: %v", err)
              }
              
              // Cache for quick access
              if err := p.cachePrice(priceData); err != nil {
                  log.Printf("Error caching price: %v", err)
              }
          }
      }
  }
  
  // Ingest BTC price from multiple exchanges
  func (p *PriceIngestionService) IngestBTCPrice(ctx context.Context) error {
      ticker := time.NewTicker(10 * time.Second)
      defer ticker.Stop()
      
      for {
          select {
          case <-ctx.Done():
              return nil
          case <-ticker.C:
              // Aggregate prices from multiple exchanges
              prices := make([]float64, 0)
              for _, exchange := range p.cryptoExchanges {
                  price, err := exchange.GetBTCPrice()
                  if err != nil {
                      continue
                  }
                  prices = append(prices, price)
              }
              
              if len(prices) == 0 {
                  continue
              }
              
              // Use median price to avoid outliers
              medianPrice := calculateMedian(prices)
              
              priceData := PriceData{
                  Timestamp:   time.Now(),
                  PriceType:   "btc",
                  Value:       medianPrice,
                  Unit:        "USD",
                  Source:      "aggregate",
              }
              
              p.publishPrice(priceData)
              p.cachePrice(priceData)
          }
      }
  }
  
  // Ingest GPU spot rates from cloud providers
  func (p *PriceIngestionService) IngestGPUSpotRates(ctx context.Context) error {
      ticker := time.NewTicker(1 * time.Minute)
      defer ticker.Stop()
      
      for {
          select {
          case <-ctx.Done():
              return nil
          case <-ticker.C:
              for _, provider := range p.cloudProviders {
                  rates, err := provider.GetGPUSpotRates()
                  if err != nil {
                      continue
                  }
                  
                  for gpuType, rate := range rates {
                      priceData := PriceData{
                          Timestamp:   time.Now(),
                          PriceType:   "gpu_spot",
                          Value:       rate,
                          Unit:        "USD/hour",
                          Source:      provider.Name(),
                          Metadata: map[string]string{
                              "gpu_type": gpuType,
                          },
                      }
                      
                      p.publishPrice(priceData)
                      p.cachePrice(priceData)
                  }
              }
          }
      }
  }
  ```

**2. Price Data Storage Service (Go)**
- [ ] Implement time-series storage optimized for price data:
  ```go
  type PriceStorageService struct {
      db *pgxpool.Pool
  }
  
  func (s *PriceStorageService) StorePriceData(ctx context.Context, price PriceData) error {
      query := `
          INSERT INTO price_data (
              timestamp, price_type, value, unit, source, region, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `
      
      _, err := s.db.Exec(ctx, query,
          price.Timestamp,
          price.PriceType,
          price.Value,
          price.Unit,
          price.Source,
          price.Region,
          price.Metadata,
      )
      
      return err
  }
  
  func (s *PriceStorageService) GetLatestPrices(ctx context.Context, priceType string) ([]PriceData, error) {
      query := `
          SELECT DISTINCT ON (source, COALESCE(metadata->>'gpu_type', ''))
              timestamp, price_type, value, unit, source, region, metadata
          FROM price_data
          WHERE price_type = $1
          ORDER BY source, COALESCE(metadata->>'gpu_type', ''), timestamp DESC
      `
      
      rows, err := s.db.Query(ctx, query, priceType)
      if err != nil {
          return nil, err
      }
      defer rows.Close()
      
      // Parse and return results
      // ...
  }
  
  func (s *PriceStorageService) GetPriceHistory(
      ctx context.Context,
      priceType string,
      start, end time.Time,
  ) ([]PriceData, error) {
      query := `
          SELECT timestamp, price_type, value, unit, source, region, metadata
          FROM price_data
          WHERE price_type = $1
              AND timestamp BETWEEN $2 AND $3
          ORDER BY timestamp ASC
      `
      
      rows, err := s.db.Query(ctx, query, priceType, start, end)
      // ...
  }
  ```

**3. Profitability Calculator Service (Go + Python)**
- [ ] Implement profitability calculation engine:
  ```go
  package profitability
  
  type ProfitabilityCalculator struct {
      priceCache   *redis.Client
      resourceRepo *ResourceRepository
  }
  
  type ProfitabilityScore struct {
      ResourceID      string
      WorkloadType    string
      Score           float64  // 0-100
      ExpectedRevenue float64  // USD/hour
      EstimatedCost   float64  // USD/hour
      NetProfit       float64  // USD/hour
      Confidence      float64  // 0-1
      Recommendation  string   // "allocate", "hold", "switch"
  }
  
  func (pc *ProfitabilityCalculator) CalculateGPUProfitability(
      ctx context.Context,
      gpuID string,
      workloadType string,
  ) (*ProfitabilityScore, error) {
      // Get current prices
      electricityPrice := pc.getLatestPrice("electricity")
      gpuSpotRate := pc.getLatestPrice("gpu_spot")
      
      // Get GPU specifications
      gpu, err := pc.resourceRepo.GetResource(ctx, gpuID)
      if err != nil {
          return nil, err
      }
      
      var expectedRevenue, estimatedCost float64
      
      switch workloadType {
      case "ai_inference":
          // Revenue from AI inference
          expectedRevenue = gpuSpotRate
          
          // Cost = electricity
          powerDraw := gpu.Specifications["max_power"].(float64) / 1000 // kW
          estimatedCost = powerDraw * electricityPrice
          
      case "bitcoin_mining":
          // This would be minimal for GPUs, but included for completeness
          // GPUs are not used for Bitcoin mining in this system
          expectedRevenue = 0
          estimatedCost = 0
      }
      
      netProfit := expectedRevenue - estimatedCost
      score := (netProfit / expectedRevenue) * 100
      
      var recommendation string
      if score > 70 {
          recommendation = "allocate"
      } else if score > 30 {
          recommendation = "hold"
      } else {
          recommendation = "switch"
      }
      
      return &ProfitabilityScore{
          ResourceID:      gpuID,
          WorkloadType:    workloadType,
          Score:           score,
          ExpectedRevenue: expectedRevenue,
          EstimatedCost:   estimatedCost,
          NetProfit:       netProfit,
          Confidence:      0.85,
          Recommendation:  recommendation,
      }, nil
  }
  
  func (pc *ProfitabilityCalculator) CalculateASICProfitability(
      ctx context.Context,
      asicID string,
  ) (*ProfitabilityScore, error) {
      // Get current prices
      electricityPrice := pc.getLatestPrice("electricity")
      btcPrice := pc.getLatestPrice("btc")
      
      // Get ASIC specifications
      asic, err := pc.resourceRepo.GetResource(ctx, asicID)
      if err != nil {
          return nil, err
      }
      
      // Calculate Bitcoin mining profitability
      hashRate := asic.Specifications["hash_rate"].(float64) // TH/s
      efficiency := asic.Specifications["efficiency"].(float64) // J/TH
      networkDifficulty := pc.getNetworkDifficulty()
      blockReward := 3.125 // BTC per block (post-2024 halving)
      
      // Expected BTC mined per day
      btcPerDay := (hashRate * 86400) / (networkDifficulty * 2^32 / 65535)
      expectedRevenue := btcPerDay * btcPrice / 24 // per hour
      
      // Power cost
      powerDraw := (hashRate * efficiency) / 3600 // kW
      estimatedCost := powerDraw * electricityPrice
      
      netProfit := expectedRevenue - estimatedCost
      score := (netProfit / expectedRevenue) * 100
      
      var recommendation string
      if netProfit > 0 {
          recommendation = "allocate"
      } else {
          recommendation = "hold"
      }
      
      return &ProfitabilityScore{
          ResourceID:      asicID,
          WorkloadType:    "bitcoin_mining",
          Score:           score,
          ExpectedRevenue: expectedRevenue,
          EstimatedCost:   estimatedCost,
          NetProfit:       netProfit,
          Confidence:      0.90,
          Recommendation:  recommendation,
      }, nil
  }
  ```

**4. Historical Analysis Service (Python)**
- [ ] Create service for historical data analysis:
  ```python
  import pandas as pd
  import numpy as np
  from datetime import datetime, timedelta
  import psycopg2
  
  class HistoricalAnalysisService:
      """Analyze historical price and profitability data"""
      
      def __init__(self, db_config):
          self.conn = psycopg2.connect(**db_config)
      
      def get_price_statistics(self, price_type: str, days: int = 30) -> dict:
          """Calculate statistics for price data"""
          query = """
              SELECT timestamp, value
              FROM price_data
              WHERE price_type = %s
                  AND timestamp > NOW() - INTERVAL '%s days'
              ORDER BY timestamp
          """
          
          df = pd.read_sql(query, self.conn, params=(price_type, days))
          
          return {
              "mean": df["value"].mean(),
              "median": df["value"].median(),
              "std": df["value"].std(),
              "min": df["value"].min(),
              "max": df["value"].max(),
              "p25": df["value"].quantile(0.25),
              "p75": df["value"].quantile(0.75),
              "p95": df["value"].quantile(0.95),
          }
      
      def calculate_price_volatility(self, price_type: str, days: int = 30) -> float:
          """Calculate price volatility (standard deviation of returns)"""
          query = """
              SELECT timestamp, value
              FROM price_data
              WHERE price_type = %s
                  AND timestamp > NOW() - INTERVAL '%s days'
              ORDER BY timestamp
          """
          
          df = pd.read_sql(query, self.conn, params=(price_type, days))
          df["returns"] = df["value"].pct_change()
          
          return df["returns"].std()
      
      def get_optimal_allocation_history(self, facility_id: str, days: int = 7) -> pd.DataFrame:
          """Get historical optimal allocation decisions"""
          query = """
              SELECT 
                  timestamp,
                  resource_type,
                  recommended_workload,
                  expected_profit,
                  actual_profit
              FROM allocation_history
              WHERE facility_id = %s
                  AND timestamp > NOW() - INTERVAL '%s days'
              ORDER BY timestamp
          """
          
          return pd.read_sql(query, self.conn, params=(facility_id, days))
  ```

**5. REST API Endpoints**
- [ ] Create API endpoints for economic data:
  ```go
  func (h *EconomicHandler) RegisterRoutes(r *gin.Engine) {
      v1 := r.Group("/api/v1/economic")
      
      v1.GET("/prices/current", h.GetCurrentPrices)
      v1.GET("/prices/history", h.GetPriceHistory)
      v1.GET("/profitability/:resource_id", h.GetResourceProfitability)
      v1.POST("/profitability/calculate", h.CalculateProfitability)
      v1.GET("/statistics", h.GetPriceStatistics)
  }
  
  func (h *EconomicHandler) GetCurrentPrices(c *gin.Context) {
      priceType := c.Query("type") // electricity, btc, gpu_spot
      
      prices, err := h.priceService.GetLatestPrices(c.Request.Context(), priceType)
      if err != nil {
          c.JSON(500, gin.H{"error": err.Error()})
          return
      }
      
      c.JSON(200, gin.H{
          "timestamp": time.Now(),
          "prices": prices,
      })
  }
  
  func (h *EconomicHandler) CalculateProfitability(c *gin.Context) {
      var req struct {
          ResourceID   string `json:"resource_id" binding:"required"`
          WorkloadType string `json:"workload_type" binding:"required"`
      }
      
      if err := c.ShouldBindJSON(&req); err != nil {
          c.JSON(400, gin.H{"error": err.Error()})
          return
      }
      
      score, err := h.profitCalculator.CalculateProfitability(
          c.Request.Context(),
          req.ResourceID,
          req.WorkloadType,
      )
      if err != nil {
          c.JSON(500, gin.H{"error": err.Error()})
          return
      }
      
      c.JSON(200, score)
  }
  ```

**6. Database Schema Updates**
- [ ] Add tables for price data and profitability scores:
  ```sql
  -- Price data table
  CREATE TABLE price_data (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ NOT NULL,
      price_type VARCHAR(50) NOT NULL, -- electricity, btc, gpu_spot
      value DECIMAL(15,6) NOT NULL,
      unit VARCHAR(20) NOT NULL,
      source VARCHAR(100) NOT NULL,
      region VARCHAR(100),
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  CREATE INDEX idx_price_data_type_time ON price_data(price_type, timestamp DESC);
  CREATE INDEX idx_price_data_source ON price_data(source, timestamp DESC);
  
  -- Convert to hypertable for time-series optimization
  SELECT create_hypertable('price_data', 'timestamp');
  
  -- Profitability scores table
  CREATE TABLE profitability_scores (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ NOT NULL,
      resource_id UUID NOT NULL REFERENCES resources(id),
      workload_type VARCHAR(50) NOT NULL,
      score DECIMAL(5,2) NOT NULL,
      expected_revenue DECIMAL(10,4),
      estimated_cost DECIMAL(10,4),
      net_profit DECIMAL(10,4),
      confidence DECIMAL(3,2),
      recommendation VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  CREATE INDEX idx_profitability_resource_time ON profitability_scores(resource_id, timestamp DESC);
  
  -- Allocation history for backtesting
  CREATE TABLE allocation_history (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ NOT NULL,
      facility_id UUID NOT NULL REFERENCES facilities(id),
      resource_id UUID NOT NULL REFERENCES resources(id),
      resource_type VARCHAR(20) NOT NULL,
      recommended_workload VARCHAR(50),
      actual_workload VARCHAR(50),
      expected_profit DECIMAL(10,4),
      actual_profit DECIMAL(10,4),
      created_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  CREATE INDEX idx_allocation_history_facility ON allocation_history(facility_id, timestamp DESC);
  ```

#### Deliverables
- [ ] Price ingestion service collecting electricity, BTC, and GPU prices
- [ ] Profitability calculator for GPUs and ASICs
- [ ] Historical analysis service with statistics
- [ ] REST API endpoints for economic data
- [ ] Database schema for price data and profitability scores
- [ ] Unit tests for all calculation logic

#### Success Criteria
- ✅ Price data ingested from all sources with <5 minute lag
- ✅ Profitability calculations completed in <50ms
- ✅ Historical data retrievable for 90+ days
- ✅ API responds with <100ms latency for current prices
- ✅ 90%+ test coverage for calculator logic

---

### **SPRINT 3: Workload Router - Classification & Queuing**
**Duration**: 2 weeks  
**Team**: Backend (Go), Platform

#### Objectives
- Implement workload classification system
- Build priority queue management
- Create intelligent routing logic
- Establish workload state machine

#### Tasks

**1. Workload Classification Service (Go)**
- [ ] Implement workload type detection and classification:
  ```go
  package workload
  
  type WorkloadType string
  
  const (
      AIInferenceRealtime WorkloadType = "ai_inference_realtime"
      AIInferenceBatch    WorkloadType = "ai_inference_batch"
      BitcoinMining       WorkloadType = "bitcoin_mining"
      ModelTraining       WorkloadType = "model_training"
  )
  
  type WorkloadClassifier struct {
      mlClient *MLClassifierClient
  }
  
  type WorkloadRequirements struct {
      GPUType      string
      GPUCount     int
      MemoryGB     int
      MaxLatencyMs int
      Duration     time.Duration
      Interruptible bool
  }
  
  func (wc *WorkloadClassifier) ClassifyWorkload(
      ctx context.Context,
      workload *Workload,
  ) (*WorkloadClassification, error) {
      // Extract features from workload
      features := wc.extractFeatures(workload)
      
      // Determine workload type
      workloadType := wc.determineType(features)
      
      // Extract requirements
      requirements := wc.extractRequirements(workload, workloadType)
      
      // Calculate priority
      priority := wc.calculatePriority(workload, workloadType, requirements)
      
      return &WorkloadClassification{
          Type:         workloadType,
          Requirements: requirements,
          Priority:     priority,
          Confidence:   0.95,
      }, nil
  }
  
  func (wc *WorkloadClassifier) determineType(features map[string]interface{}) WorkloadType {
      // Check explicit workload type if provided
      if wt, ok := features["workload_type"].(string); ok {
          return WorkloadType(wt)
      }
      
      // Infer from model name or request characteristics
      if modelName, ok := features["model_name"].(string); ok {
          if strings.Contains(modelName, "stable-diffusion") ||
             strings.Contains(modelName, "llama") ||
             strings.Contains(modelName, "gpt") {
              // Check latency requirements
              if maxLatency, ok := features["max_latency_ms"].(int); ok && maxLatency < 1000 {
                  return AIInferenceRealtime
              }
              return AIInferenceBatch
          }
      }
      
      // Check for training indicators
      if isTraining, ok := features["is_training"].(bool); ok && isTraining {
          return ModelTraining
      }
      
      // Default to batch inference
      return AIInferenceBatch
  }
  
  func (wc *WorkloadClassifier) extractRequirements(
      workload *Workload,
      workloadType WorkloadType,
  ) WorkloadRequirements {
      req := WorkloadRequirements{
          Interruptible: true,
      }
      
      switch workloadType {
      case AIInferenceRealtime:
          req.GPUType = "H100"
          req.GPUCount = workload.Spec.GPUCount
          req.MemoryGB = workload.Spec.MemoryGB
          req.MaxLatencyMs = 100
          req.Interruptible = false
          
      case AIInferenceBatch:
          req.GPUType = "H100"
          req.GPUCount = workload.Spec.GPUCount
          req.MemoryGB = workload.Spec.MemoryGB
          req.MaxLatencyMs = 5000
          req.Interruptible = true
          
      case ModelTraining:
          req.GPUType = "H100"
          req.GPUCount = workload.Spec.GPUCount
          req.MemoryGB = workload.Spec.MemoryGB
          req.Duration = workload.Spec.EstimatedDuration
          req.Interruptible = true
          
      case BitcoinMining:
          // Bitcoin mining handled by ASICs
          req.Interruptible = true
      }
      
      return req
  }
  
  func (wc *WorkloadClassifier) calculatePriority(
      workload *Workload,
      workloadType WorkloadType,
      requirements WorkloadRequirements,
  ) int {
      // Priority scale: 1 (highest) to 10 (lowest)
      
      // Base priority by workload type
      basePriority := map[WorkloadType]int{
          AIInferenceRealtime: 1,
          ModelTraining:       2,
          AIInferenceBatch:    2,
          BitcoinMining:       3,
      }
      
      priority := basePriority[workloadType]
      
      // Adjust by customer tier
      switch workload.CustomerTier {
      case "enterprise":
          priority -= 1
      case "pro":
          // no adjustment
      case "free":
          priority += 1
      }
      
      // Ensure priority is in valid range
      if priority < 1 {
          priority = 1
      }
      if priority > 10 {
          priority = 10
      }
      
      return priority
  }
  ```

**2. Priority Queue Service (Go)**
- [ ] Implement multi-level priority queue with fairness:
  ```go
  package queue
  
  type PriorityQueue struct {
      queues map[int]*list.List // priority -> queue
      mu     sync.RWMutex
      cond   *sync.Cond
      maxSize int
  }
  
  func NewPriorityQueue(maxSize int) *PriorityQueue {
      pq := &PriorityQueue{
          queues:  make(map[int]*list.List),
          maxSize: maxSize,
      }
      pq.cond = sync.NewCond(&pq.mu)
      
      // Initialize queues for priorities 1-10
      for i := 1; i <= 10; i++ {
          pq.queues[i] = list.New()
      }
      
      return pq
  }
  
  func (pq *PriorityQueue) Enqueue(workload *Workload) error {
      pq.mu.Lock()
      defer pq.mu.Unlock()
      
      // Check if queue is full
      if pq.size() >= pq.maxSize {
          return fmt.Errorf("queue is full")
      }
      
      // Add to appropriate priority queue
      queue := pq.queues[workload.Priority]
      queue.PushBack(workload)
      
      // Signal waiting dequeue operations
      pq.cond.Signal()
      
      return nil
  }
  
  func (pq *PriorityQueue) Dequeue(ctx context.Context) (*Workload, error) {
      pq.mu.Lock()
      defer pq.mu.Unlock()
      
      for {
          // Try to dequeue from highest priority queue
          for priority := 1; priority <= 10; priority++ {
              queue := pq.queues[priority]
              if queue.Len() > 0 {
                  element := queue.Front()
                  queue.Remove(element)
                  return element.Value.(*Workload), nil
              }
          }
          
          // No workloads available, wait for signal
          select {
          case <-ctx.Done():
              return nil, ctx.Err()
          default:
              pq.cond.Wait()
          }
      }
  }
  
  func (pq *PriorityQueue) DequeueWithFairness(ctx context.Context) (*Workload, error) {
      // Implement weighted fair queuing
      // Higher priority queues get serviced more often, but lower priority
      // queues are not starved
      
      pq.mu.Lock()
      defer pq.mu.Unlock()
      
      // Weights for each priority level (higher weight = more likely to be serviced)
      weights := map[int]int{
          1: 50, 2: 25, 3: 15, 4: 5, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1,
      }
      
      for {
          // Calculate weighted random selection
          totalWeight := 0
          eligibleQueues := make([]int, 0)
          
          for priority := 1; priority <= 10; priority++ {
              if pq.queues[priority].Len() > 0 {
                  totalWeight += weights[priority]
                  eligibleQueues = append(eligibleQueues, priority)
              }
          }
          
          if len(eligibleQueues) == 0 {
              // No workloads available, wait
              select {
              case <-ctx.Done():
                  return nil, ctx.Err()
              default:
                  pq.cond.Wait()
                  continue
              }
          }
          
          // Select queue based on weighted probability
          rand := rand.Intn(totalWeight)
          cumWeight := 0
          
          for _, priority := range eligibleQueues {
              cumWeight += weights[priority]
              if rand < cumWeight {
                  queue := pq.queues[priority]
                  element := queue.Front()
                  queue.Remove(element)
                  return element.Value.(*Workload), nil
              }
          }
      }
  }
  
  func (pq *PriorityQueue) size() int {
      total := 0
      for _, queue := range pq.queues {
          total += queue.Len()
      }
      return total
  }
  
  func (pq *PriorityQueue) GetQueueDepths() map[int]int {
      pq.mu.RLock()
      defer pq.mu.RUnlock()
      
      depths := make(map[int]int)
      for priority, queue := range pq.queues {
          depths[priority] = queue.Len()
      }
      return depths
  }
  ```

**3. Workload State Machine (Go)**
- [ ] Implement workload lifecycle management:
  ```go
  package workload
  
  type WorkloadState string
  
  const (
      StateQueued    WorkloadState = "queued"
      StateScheduled WorkloadState = "scheduled"
      StateRunning   WorkloadState = "running"
      StateCompleted WorkloadState = "completed"
      StateFailed    WorkloadState = "failed"
      StateCancelled WorkloadState = "cancelled"
      StatePaused    WorkloadState = "paused"
  )
  
  type WorkloadStateMachine struct {
      workloadRepo *WorkloadRepository
      eventBus     *EventBus
  }
  
  func (wsm *WorkloadStateMachine) TransitionState(
      ctx context.Context,
      workloadID string,
      newState WorkloadState,
  ) error {
      workload, err := wsm.workloadRepo.Get(ctx, workloadID)
      if err != nil {
          return err
      }
      
      // Validate state transition
      if !wsm.isValidTransition(workload.State, newState) {
          return fmt.Errorf("invalid state transition from %s to %s", workload.State, newState)
      }
      
      // Update state
      oldState := workload.State
      workload.State = newState
      workload.UpdatedAt = time.Now()
      
      // Update timestamps based on state
      switch newState {
      case StateScheduled:
          workload.ScheduledAt = timePtr(time.Now())
      case StateRunning:
          workload.StartedAt = timePtr(time.Now())
      case StateCompleted, StateFailed, StateCancelled:
          workload.CompletedAt = timePtr(time.Now())
          
          // Calculate actual duration and cost
          if workload.StartedAt != nil {
              duration := workload.CompletedAt.Sub(*workload.StartedAt)
              workload.ActualDuration = &duration
          }
      }
      
      // Save to database
      if err := wsm.workloadRepo.Update(ctx, workload); err != nil {
          return err
      }
      
      // Publish state change event
      event := WorkloadStateChangedEvent{
          WorkloadID: workloadID,
          OldState:   oldState,
          NewState:   newState,
          Timestamp:  time.Now(),
      }
      wsm.eventBus.Publish("workload.state.changed", event)
      
      return nil
  }
  
  func (wsm *WorkloadStateMachine) isValidTransition(from, to WorkloadState) bool {
      validTransitions := map[WorkloadState][]WorkloadState{
          StateQueued: {StateScheduled, StateCancelled},
          StateScheduled: {StateRunning, StateCancelled, StateQueued},
          StateRunning: {StateCompleted, StateFailed, StateCancelled, StatePaused},
          StatePaused: {StateRunning, StateCancelled},
          StateCompleted: {},
          StateFailed: {},
          StateCancelled: {},
      }
      
      allowed, ok := validTransitions[from]
      if !ok {
          return false
      }
      
      for _, state := range allowed {
          if state == to {
              return true
          }
      }
      
      return false
  }
  ```

**4. Workload Routing Service (Go)**
- [ ] Implement routing logic based on requirements and resource availability:
  ```go
  package routing
  
  type WorkloadRouter struct {
      resourceManager *ResourceManager
      profitCalculator *ProfitabilityCalculator
      costEstimator   *CostEstimator
  }
  
  type RoutingDecision struct {
      WorkloadID     string
      TargetFacility string
      TargetResources []string
      EstimatedCost   float64
      EstimatedLatency int
      Confidence      float64
      Reason          string
  }
  
  func (wr *WorkloadRouter) RouteWorkload(
      ctx context.Context,
      workload *Workload,
      requirements WorkloadRequirements,
  ) (*RoutingDecision, error) {
      // Get available resources matching requirements
      candidates, err := wr.findCandidateResources(ctx, requirements)
      if err != nil {
          return nil, err
      }
      
      if len(candidates) == 0 {
          return nil, fmt.Errorf("no suitable resources available")
      }
      
      // Score each candidate based on multiple factors
      scores := make([]ResourceScore, 0, len(candidates))
      for _, candidate := range candidates {
          score := wr.scoreResource(ctx, workload, requirements, candidate)
          scores = append(scores, score)
      }
      
      // Sort by score (highest first)
      sort.Slice(scores, func(i, j int) bool {
          return scores[i].TotalScore > scores[j].TotalScore
      })
      
      // Select best resource
      best := scores[0]
      
      return &RoutingDecision{
          WorkloadID:       workload.ID,
          TargetFacility:   best.Resource.FacilityID,
          TargetResources:  []string{best.Resource.ID},
          EstimatedCost:    best.EstimatedCost,
          EstimatedLatency: best.EstimatedLatency,
          Confidence:       best.TotalScore,
          Reason:           best.Reason,
      }, nil
  }
  
  type ResourceScore struct {
      Resource         *Resource
      LatencyScore     float64
      CostScore        float64
      AvailabilityScore float64
      ProfitabilityScore float64
      TotalScore       float64
      EstimatedCost    float64
      EstimatedLatency int
      Reason           string
  }
  
  func (wr *WorkloadRouter) scoreResource(
      ctx context.Context,
      workload *Workload,
      requirements WorkloadRequirements,
      resource *Resource,
  ) ResourceScore {
      score := ResourceScore{
          Resource: resource,
      }
      
      // Calculate latency score (lower latency = higher score)
      latency := wr.estimateLatency(workload, resource)
      if requirements.MaxLatencyMs > 0 {
          if latency <= requirements.MaxLatencyMs {
              score.LatencyScore = 100 * (1 - float64(latency)/float64(requirements.MaxLatencyMs))
          } else {
              score.LatencyScore = 0 // Doesn't meet requirements
          }
      } else {
          score.LatencyScore = 50 // Neutral if no latency requirement
      }
      
      // Calculate cost score (lower cost = higher score)
      cost := wr.costEstimator.EstimateCost(workload, resource)
      score.EstimatedCost = cost
      // Normalize cost to 0-100 scale
      maxCost := 100.0 // Max expected cost per hour
      score.CostScore = 100 * (1 - math.Min(cost/maxCost, 1.0))
      
      // Calculate availability score (more available = higher score)
      utilization := resource.CurrentUtilization
      score.AvailabilityScore = 100 * (1 - utilization)
      
      // Calculate profitability score (from economic optimizer)
      profitScore, _ := wr.profitCalculator.CalculateProfitability(
          ctx,
          resource.ID,
          string(workload.Type),
      )
      if profitScore != nil {
          score.ProfitabilityScore = profitScore.Score
      }
      
      // Weighted total score
      weights := map[string]float64{
          "latency":       0.3,
          "cost":          0.3,
          "availability":  0.2,
          "profitability": 0.2,
      }
      
      score.TotalScore = 
          score.LatencyScore * weights["latency"] +
          score.CostScore * weights["cost"] +
          score.AvailabilityScore * weights["availability"] +
          score.ProfitabilityScore * weights["profitability"]
      
      score.Reason = fmt.Sprintf(
          "Latency: %dms, Cost: $%.2f/hr, Utilization: %.1f%%",
          latency, cost, utilization*100,
      )
      
      return score
  }
  
  func (wr *WorkloadRouter) findCandidateResources(
      ctx context.Context,
      requirements WorkloadRequirements,
  ) ([]*Resource, error) {
      // Query resource manager for available resources
      filter := ResourceFilter{
          Type:      "GPU",
          Subtype:   requirements.GPUType,
          MinMemory: requirements.MemoryGB * 1024, // Convert to MB
          Status:    []string{"available", "partial"},
          MinAvailableCount: requirements.GPUCount,
      }
      
      return wr.resourceManager.FindResources(ctx, filter)
  }
  ```

**5. REST API for Workload Management**
- [ ] Create API endpoints:
  ```go
  func (h *WorkloadHandler) RegisterRoutes(r *gin.Engine) {
      v1 := r.Group("/api/v1/workloads")
      v1.Use(authMiddleware())
      
      v1.POST("/submit", h.SubmitWorkload)
      v1.GET("/:id", h.GetWorkload)
      v1.GET("/:id/status", h.GetWorkloadStatus)
      v1.PUT("/:id/cancel", h.CancelWorkload)
      v1.GET("/queue/depth", h.GetQueueDepth)
      v1.GET("", h.ListWorkloads)
  }
  
  func (h *WorkloadHandler) SubmitWorkload(c *gin.Context) {
      var req SubmitWorkloadRequest
      if err := c.ShouldBindJSON(&req); err != nil {
          c.JSON(400, gin.H{"error": err.Error()})
          return
      }
      
      // Validate request
      if err := req.Validate(); err != nil {
          c.JSON(400, gin.H{"error": err.Error()})
          return
      }
      
      // Get customer from auth context
      customerID := c.GetString("customer_id")
      
      // Create workload
      workload := &Workload{
          ID:          uuid.New().String(),
          CustomerID:  customerID,
          Type:        WorkloadType(req.WorkloadType),
          State:       StateQueued,
          Spec:        req.Spec,
          CreatedAt:   time.Now(),
      }
      
      // Classify workload
      classification, err := h.classifier.ClassifyWorkload(c.Request.Context(), workload)
      if err != nil {
          c.JSON(500, gin.H{"error": "failed to classify workload"})
          return
      }
      
      workload.Priority = classification.Priority
      workload.Requirements = classification.Requirements
      
      // Save to database
      if err := h.workloadRepo.Create(c.Request.Context(), workload); err != nil {
          c.JSON(500, gin.H{"error": "failed to create workload"})
          return
      }
      
      // Add to queue
      if err := h.queue.Enqueue(workload); err != nil {
          c.JSON(503, gin.H{"error": "queue is full, please try again later"})
          return
      }
      
      // Return response
      c.JSON(200, gin.H{
          "workload_id": workload.ID,
          "status":      workload.State,
          "priority":    workload.Priority,
          "queue_position": h.estimateQueuePosition(workload),
      })
  }
  ```

#### Deliverables
- [ ] Workload classification service with ML integration
- [ ] Multi-level priority queue with fairness guarantees
- [ ] Workload state machine with event publishing
- [ ] Intelligent routing service with scoring algorithm
- [ ] REST API for workload submission and management
- [ ] Unit and integration tests

#### Success Criteria
- ✅ Workload classified correctly with >95% accuracy
- ✅ Queue operations complete in <10ms
- ✅ Routing decisions made in <100ms
- ✅ State transitions validated and logged
- ✅ API handles 10,000+ concurrent workload submissions
- ✅ Fair queuing prevents starvation of lower priority workloads

---

### **SPRINT 4: Resource Manager - Discovery & Inventory**
**Duration**: 2 weeks  
**Team**: Backend (Rust, Go), Platform

#### Objectives
- Implement automated resource discovery
- Build resource inventory management
- Create resource allocation engine
- Establish resource health tracking

#### Tasks

**1. Resource Discovery Service (Rust)**
- [ ] Create high-performance resource discovery service:
  ```rust
  use tokio::time::{interval, Duration};
  use std::collections::HashMap;
  use uuid::Uuid;
  
  #[derive(Debug, Clone)]
  pub struct Resource {
      pub id: String,
      pub facility_id: String,
      pub resource_type: ResourceType,
      pub subtype: String,
      pub specifications: HashMap<String, serde_json::Value>,
      pub status: ResourceStatus,
      pub current_workload: Option<String>,
      pub utilization: f64,
      pub metadata: HashMap<String, String>,
  }
  
  #[derive(Debug, Clone)]
  pub enum ResourceType {
      GPU,
      ASIC,
      CPU,
      Network,
      Storage,
  }
  
  #[derive(Debug, Clone)]
  pub enum ResourceStatus {
      Available,
      Allocated,
      Maintenance,
      Failed,
      Unknown,
  }
  
  pub struct ResourceDiscoveryService {
      gpu_sim_client: GpuSimulatorClient,
      asic_sim_client: AsicSimulatorClient,
      resource_repo: ResourceRepository,
      event_publisher: EventPublisher,
  }
  
  impl ResourceDiscoveryService {
      pub async fn start_discovery_loop(&self) {
          let mut interval = interval(Duration::from_secs(30));
          
          loop {
              interval.tick().await;
              
              match self.discover_resources().await {
                  Ok(discovered) => {
                      info!("Discovered {} resources", discovered.len());
                      self.update_inventory(discovered).await;
                  }
                  Err(e) => {
                      error!("Resource discovery failed: {}", e);
                  }
              }
          }
      }
      
      async fn discover_resources(&self) -> Result<Vec<Resource>, Box<dyn std::error::Error>> {
          let mut resources = Vec::new();
          
          // Discover GPUs from simulator
          let gpus = self.discover_gpus().await?;
          resources.extend(gpus);
          
          // Discover ASICs from simulator
          let asics = self.discover_asics().await?;
          resources.extend(asics);
          
          Ok(resources)
      }
      
      async fn discover_gpus(&self) -> Result<Vec<Resource>, Box<dyn std::error::Error>> {
          let gpu_list = self.gpu_sim_client.list_gpus().await?;
          
          let mut resources = Vec::new();
          for gpu_info in gpu_list {
              let resource = Resource {
                  id: gpu_info.id,
                  facility_id: gpu_info.facility_id,
                  resource_type: ResourceType::GPU,
                  subtype: gpu_info.model,
                  specifications: HashMap::from([
                      ("memory_gb".to_string(), json!(gpu_info.memory_gb)),
                      ("compute_capability".to_string(), json!(gpu_info.compute_capability)),
                      ("max_power_w".to_string(), json!(gpu_info.max_power)),
                  ]),
                  status: self.map_status(&gpu_info.status),
                  current_workload: gpu_info.workload_id,
                  utilization: gpu_info.utilization,
                  metadata: gpu_info.metadata,
              };
              resources.push(resource);
          }
          
          Ok(resources)
      }
      
      async fn discover_asics(&self) -> Result<Vec<Resource>, Box<dyn std::error::Error>> {
          let asic_list = self.asic_sim_client.list_asics().await?;
          
          let mut resources = Vec::new();
          for asic_info in asic_list {
              let resource = Resource {
                  id: asic_info.id,
                  facility_id: asic_info.facility_id,
                  resource_type: ResourceType::ASIC,
                  subtype: asic_info.model,
                  specifications: HashMap::from([
                      ("hash_rate_ths".to_string(), json!(asic_info.hash_rate)),
                      ("efficiency_j_th".to_string(), json!(asic_info.efficiency)),
                      ("max_power_w".to_string(), json!(asic_info.max_power)),
                  ]),
                  status: self.map_status(&asic_info.status),
                  current_workload: asic_info.workload_id,
                  utilization: if asic_info.is_mining { 1.0 } else { 0.0 },
                  metadata: asic_info.metadata,
              };
              resources.push(resource);
          }
          
          Ok(resources)
      }
      
      async fn update_inventory(&self, resources: Vec<Resource>) {
          for resource in resources {
              match self.resource_repo.upsert(&resource).await {
                  Ok(_) => {
                      // Publish resource discovered event
                      self.event_publisher.publish(
                          "resource.discovered",
                          &resource,
                      ).await;
                  }
                  Err(e) => {
                      error!("Failed to update resource {}: {}", resource.id, e);
                  }
              }
          }
      }
  }
  ```

**2. Resource Allocation Engine (Go)**
- [ ] Implement resource allocation and deallocation:
  ```go
  package allocation
  
  type AllocationEngine struct {
      resourceRepo    *ResourceRepository
      workloadRepo    *WorkloadRepository
      allocationRepo  *AllocationRepository
      eventBus        *EventBus
      mu              sync.RWMutex
  }
  
  type Allocation struct {
      ID          string
      WorkloadID  string
      ResourceIDs []string
      AllocatedAt time.Time
      ReleasedAt  *time.Time
      Status      AllocationStatus
  }
  
  type AllocationStatus string
  
  const (
      AllocationPending   AllocationStatus = "pending"
      AllocationActive    AllocationStatus = "active"
      AllocationReleased  AllocationStatus = "released"
      AllocationFailed    AllocationStatus = "failed"
  )
  
  func (ae *AllocationEngine) AllocateResources(
      ctx context.Context,
      workloadID string,
      resourceIDs []string,
  ) (*Allocation, error) {
      ae.mu.Lock()
      defer ae.mu.Unlock()
      
      // Verify all resources are available
      for _, resourceID := range resourceIDs {
          resource, err := ae.resourceRepo.Get(ctx, resourceID)
          if err != nil {
              return nil, fmt.Errorf("resource %s not found: %w", resourceID, err)
          }
          
          if resource.Status != "available" && resource.Status != "partial" {
              return nil, fmt.Errorf("resource %s is not available", resourceID)
          }
      }
      
      // Create allocation record
      allocation := &Allocation{
          ID:          uuid.New().String(),
          WorkloadID:  workloadID,
          ResourceIDs: resourceIDs,
          AllocatedAt: time.Now(),
          Status:      AllocationPending,
      }
      
      // Save allocation
      if err := ae.allocationRepo.Create(ctx, allocation); err != nil {
          return nil, err
      }
      
      // Update resource status
      for _, resourceID := range resourceIDs {
          if err := ae.resourceRepo.UpdateStatus(ctx, resourceID, "allocated"); err != nil {
              // Rollback allocation
              ae.allocationRepo.Delete(ctx, allocation.ID)
              return nil, err
          }
          
          if err := ae.resourceRepo.SetWorkload(ctx, resourceID, workloadID); err != nil {
              return nil, err
          }
      }
      
      // Mark allocation as active
      allocation.Status = AllocationActive
      ae.allocationRepo.Update(ctx, allocation)
      
      // Publish event
      ae.eventBus.Publish("allocation.created", allocation)
      
      return allocation, nil
  }
  
  func (ae *AllocationEngine) ReleaseResources(
      ctx context.Context,
      allocationID string,
  ) error {
      ae.mu.Lock()
      defer ae.mu.Unlock()
      
      allocation, err := ae.allocationRepo.Get(ctx, allocationID)
      if err != nil {
          return err
      }
      
      if allocation.Status == AllocationReleased {
          return fmt.Errorf("allocation already released")
      }
      
      // Update resource status
      for _, resourceID := range allocation.ResourceIDs {
          if err := ae.resourceRepo.UpdateStatus(ctx, resourceID, "available"); err != nil {
              log.Printf("Error releasing resource %s: %v", resourceID, err)
          }
          
          if err := ae.resourceRepo.ClearWorkload(ctx, resourceID); err != nil {
              log.Printf("Error clearing workload on resource %s: %v", resourceID, err)
          }
      }
      
      // Update allocation
      now := time.Now()
      allocation.ReleasedAt = &now
      allocation.Status = AllocationReleased
      
      if err := ae.allocationRepo.Update(ctx, allocation); err != nil {
          return err
      }
      
      // Publish event
      ae.eventBus.Publish("allocation.released", allocation)
      
      return nil
  }
  
  func (ae *AllocationEngine) GetResourceUtilization(
      ctx context.Context,
      facilityID string,
  ) (*UtilizationReport, error) {
      resources, err := ae.resourceRepo.GetByFacility(ctx, facilityID)
      if err != nil {
          return nil, err
      }
      
      report := &UtilizationReport{
          FacilityID: facilityID,
          Timestamp:  time.Now(),
          ByType:     make(map[string]*TypeUtilization),
      }
      
      // Calculate utilization by resource type
      for _, resource := range resources {
          typeKey := resource.Type
          if _, exists := report.ByType[typeKey]; !exists {
              report.ByType[typeKey] = &TypeUtilization{}
          }
          
          typeUtil := report.ByType[typeKey]
          typeUtil.Total++
          
          switch resource.Status {
          case "available":
              typeUtil.Available++
          case "allocated":
              typeUtil.Allocated++
          case "maintenance":
              typeUtil.Maintenance++
          case "failed":
              typeUtil.Failed++
          }
          
          typeUtil.TotalUtilization += resource.CurrentUtilization
      }
      
      // Calculate percentages
      for _, typeUtil := range report.ByType {
          if typeUtil.Total > 0 {
              typeUtil.UtilizationPercent = (typeUtil.TotalUtilization / float64(typeUtil.Total)) * 100
              typeUtil.AllocationPercent = (float64(typeUtil.Allocated) / float64(typeUtil.Total)) * 100
          }
      }
      
      return report, nil
  }
  ```

**3. Resource Health Monitor (Rust)**
- [ ] Implement real-time health monitoring:
  ```rust
  use tokio::sync::mpsc;
  
  pub struct ResourceHealthMonitor {
      metrics_consumer: MetricsConsumer,
      health_checker: HealthChecker,
      alert_manager: AlertManager,
  }
  
  #[derive(Debug, Clone)]
  pub struct HealthCheck {
      pub resource_id: String,
      pub timestamp: chrono::DateTime<chrono::Utc>,
      pub status: HealthStatus,
      pub metrics: HealthMetrics,
      pub issues: Vec<HealthIssue>,
  }
  
  #[derive(Debug, Clone)]
  pub enum HealthStatus {
      Healthy,
      Warning,
      Critical,
      Unknown,
  }
  
  #[derive(Debug, Clone)]
  pub struct HealthMetrics {
      pub temperature_c: f64,
      pub utilization: f64,
      pub memory_used_mb: u64,
      pub memory_total_mb: u64,
      pub power_draw_w: f64,
      pub error_count: u64,
  }
  
  #[derive(Debug, Clone)]
  pub struct HealthIssue {
      pub severity: String,
      pub issue_type: String,
      pub message: String,
  }
  
  impl ResourceHealthMonitor {
      pub async fn start_monitoring(&self) {
          let (tx, mut rx) = mpsc::channel(1000);
          
          // Start consuming metrics
          tokio::spawn(async move {
              self.consume_metrics(tx).await;
          });
          
          // Process health checks
          while let Some(metrics) = rx.recv().await {
              let health = self.check_health(metrics).await;
              
              if health.status != HealthStatus::Healthy {
                  self.handle_unhealthy_resource(health).await;
              }
          }
      }
      
      async fn check_health(&self, metrics: ResourceMetrics) -> HealthCheck {
          let mut issues = Vec::new();
          let mut status = HealthStatus::Healthy;
          
          // Check temperature
          if metrics.temperature_c > 85.0 {
              issues.push(HealthIssue {
                  severity: "critical".to_string(),
                  issue_type: "high_temperature".to_string(),
                  message: format!("Temperature {}°C exceeds critical threshold", metrics.temperature_c),
              });
              status = HealthStatus::Critical;
          } else if metrics.temperature_c > 75.0 {
              issues.push(HealthIssue {
                  severity: "warning".to_string(),
                  issue_type: "elevated_temperature".to_string(),
                  message: format!("Temperature {}°C exceeds warning threshold", metrics.temperature_c),
              });
              if status == HealthStatus::Healthy {
                  status = HealthStatus::Warning;
              }
          }
          
          // Check memory
          let memory_percent = (metrics.memory_used_mb as f64 / metrics.memory_total_mb as f64) * 100.0;
          if memory_percent > 95.0 {
              issues.push(HealthIssue {
                  severity: "critical".to_string(),
                  issue_type: "high_memory".to_string(),
                  message: format!("Memory usage {:.1}% exceeds critical threshold", memory_percent),
              });
              status = HealthStatus::Critical;
          }
          
          // Check error rate
          if metrics.error_count > 100 {
              issues.push(HealthIssue {
                  severity: "warning".to_string(),
                  issue_type: "high_error_rate".to_string(),
                  message: format!("Error count {} exceeds threshold", metrics.error_count),
              });
              if status == HealthStatus::Healthy {
                  status = HealthStatus::Warning;
              }
          }
          
          HealthCheck {
              resource_id: metrics.resource_id,
              timestamp: chrono::Utc::now(),
              status,
              metrics: HealthMetrics {
                  temperature_c: metrics.temperature_c,
                  utilization: metrics.utilization,
                  memory_used_mb: metrics.memory_used_mb,
                  memory_total_mb: metrics.memory_total_mb,
                  power_draw_w: metrics.power_draw_w,
                  error_count: metrics.error_count,
              },
              issues,
          }
      }
      
      async fn handle_unhealthy_resource(&self, health: HealthCheck) {
          // Log issue
          warn!("Unhealthy resource {}: {:?}", health.resource_id, health.status);
          
          // Create alert
          for issue in &health.issues {
              if issue.severity == "critical" {
                  self.alert_manager.create_alert(
                      &health.resource_id,
                      &issue.issue_type,
                      &issue.message,
                  ).await;
              }
          }
          
          // Take automated action if critical
          if health.status == HealthStatus::Critical {
              self.take_remediation_action(&health).await;
          }
      }
      
      async fn take_remediation_action(&self, health: &HealthCheck) {
          // Implement automated remediation
          // e.g., move workloads off resource, trigger cooling increase, etc.
          info!("Taking remediation action for resource {}", health.resource_id);
      }
  }
  ```

**4. Capacity Planning Service (Python)**
- [ ] Implement capacity forecasting:
  ```python
  import numpy as np
  import pandas as pd
  from sklearn.ensemble import RandomForestRegressor
  from datetime import datetime, timedelta
  
  class CapacityPlanningService:
      """Forecast resource capacity needs"""
      
      def __init__(self, db_config):
          self.conn = psycopg2.connect(**db_config)
          self.model = RandomForestRegressor(n_estimators=100)
      
      def forecast_capacity_needs(
          self,
          facility_id: str,
          horizon_days: int = 30
      ) -> pd.DataFrame:
          """Forecast capacity needs for the next N days"""
          
          # Get historical data
          historical_data = self.get_historical_utilization(facility_id, days=90)
          
          # Prepare features
          X, y = self.prepare_training_data(historical_data)
          
          # Train model
          self.model.fit(X, y)
          
          # Generate future dates
          future_dates = pd.date_range(
              start=datetime.now(),
              periods=horizon_days,
              freq='D'
          )
          
          # Forecast
          forecasts = []
          for date in future_dates:
              features = self.extract_features(date)
              prediction = self.model.predict([features])[0]
              
              forecasts.append({
                  'date': date,
                  'predicted_utilization': prediction,
                  'recommended_capacity': self.calculate_recommended_capacity(prediction)
              })
          
          return pd.DataFrame(forecasts)
      
      def get_historical_utilization(self, facility_id: str, days: int) -> pd.DataFrame:
          query = """
              SELECT 
                  DATE(timestamp) as date,
                  resource_type,
                  AVG(value) as avg_utilization
              FROM metrics
              WHERE resource_id IN (
                  SELECT id FROM resources WHERE facility_id = %s
              )
              AND metric_name = 'utilization'
              AND timestamp > NOW() - INTERVAL '%s days'
              GROUP BY DATE(timestamp), resource_type
              ORDER BY date
          """
          
          return pd.read_sql(query, self.conn, params=(facility_id, days))
      
      def prepare_training_data(self, df: pd.DataFrame):
          """Prepare features for training"""
          X = []
          y = []
          
          for idx, row in df.iterrows():
              features = [
                  row['date'].dayofweek,
                  row['date'].day,
                  row['date'].month,
                  # Add more features
              ]
              X.append(features)
              y.append(row['avg_utilization'])
          
          return np.array(X), np.array(y)
      
      def calculate_recommended_capacity(self, predicted_utilization: float) -> dict:
          """Calculate recommended capacity based on forecast"""
          
          # Add buffer for safety
          safety_buffer = 1.2
          target_capacity = predicted_utilization * safety_buffer
          
          return {
              'gpu_count': int(target_capacity * 1000),  # Example calculation
              'asic_count': int(target_capacity * 5000),
              'buffer_percent': (safety_buffer - 1) * 100
          }
  ```

**5. REST API Endpoints**
- [ ] Create resource management APIs:
  ```go
  func (h *ResourceHandler) RegisterRoutes(r *gin.Engine) {
      v1 := r.Group("/api/v1/resources")
      
      v1.GET("", h.ListResources)
      v1.GET("/:id", h.GetResource)
      v1.GET("/:id/health", h.GetResourceHealth)
      v1.GET("/availability", h.CheckAvailability)
      v1.GET("/utilization", h.GetUtilization)
      v1.POST("/allocate", h.AllocateResources)
      v1.POST("/release", h.ReleaseResources)
      v1.GET("/capacity/forecast", h.GetCapacityForecast)
  }
  ```

#### Deliverables
- [ ] Automated resource discovery system
- [ ] Resource allocation and deallocation engine
- [ ] Real-time health monitoring with alerting
- [ ] Capacity planning and forecasting
- [ ] Resource management REST APIs
- [ ] Comprehensive tests

#### Success Criteria
- ✅ Resources discovered within 30 seconds of coming online
- ✅ Allocation/deallocation operations complete in <100ms
- ✅ Health checks run at 1Hz frequency
- ✅ Critical issues detected and alerted within 5 seconds
- ✅ Capacity forecasts accurate within 10%

---

### **SPRINT 5: Resource Manager - Workload Execution & Switching**
**Duration**: 2 weeks  
**Team**: Backend (Rust, Go), Platform

#### Objectives
- Implement workload execution engine
- Build rapid workload switching capability
- Create preemption and migration support
- Establish workload lifecycle management

#### Tasks

**1. Workload Execution Engine (Go)**
- [ ] Implement workload execution coordinator:
  ```go
  package execution
  
  type WorkloadExecutor struct {
      orchestrator    *OrchestratorService
      allocationEngine *AllocationEngine
      router          *WorkloadRouter
      gpuController   *GPUController
      asicController  *ASICController
      stateManager    *StateManager
  }
  
  func (we *WorkloadExecutor) ExecuteWorkload(
      ctx context.Context,
      workloadID string,
  ) error {
      // Get workload details
      workload, err := we.getWorkload(ctx, workloadID)
      if err != nil {
          return err
      }
      
      // Route to appropriate resources
      routing, err := we.router.RouteWorkload(ctx, workload, workload.Requirements)
      if err != nil {
          return fmt.Errorf("routing failed: %w", err)
      }
      
      // Allocate resources
      allocation, err := we.allocationEngine.AllocateResources(
          ctx,
          workloadID,
          routing.TargetResources,
      )
      if err != nil {
          return fmt.Errorf("allocation failed: %w", err)
      }
      
      // Update workload state
      we.stateManager.TransitionState(ctx, workloadID, StateScheduled)
      
      // Start workload on resources
      if err := we.startWorkload(ctx, workload, allocation); err != nil {
          // Rollback on failure
          we.allocationEngine.ReleaseResources(ctx, allocation.ID)
          we.stateManager.TransitionState(ctx, workloadID, StateFailed)
          return err
      }
      
      // Update state to running
      we.stateManager.TransitionState(ctx, workloadID, StateRunning)
      
      // Monitor workload execution
      go we.monitorWorkload(ctx, workloadID)
      
      return nil
  }
  
  func (we *WorkloadExecutor) startWorkload(
      ctx context.Context,
      workload *Workload,
      allocation *Allocation,
  ) error {
      switch workload.Type {
      case AIInferenceRealtime, AIInferenceBatch, ModelTraining:
          return we.startAIWorkload(ctx, workload, allocation)
      case BitcoinMining:
          return we.startMiningWorkload(ctx, workload, allocation)
      default:
          return fmt.Errorf("unknown workload type: %s", workload.Type)
      }
  }
  
  func (we *WorkloadExecutor) startAIWorkload(
      ctx context.Context,
      workload *Workload,
      allocation *Allocation,
  ) error {
      // Prepare GPU configuration
      config := GPUWorkloadConfig{
          WorkloadID:  workload.ID,
          ModelName:   workload.Spec.ModelName,
          BatchSize:   workload.Spec.BatchSize,
          MaxLatency:  workload.Requirements.MaxLatencyMs,
          GPUIDs:      allocation.ResourceIDs,
      }
      
      // Start workload on GPUs
      for _, gpuID := range allocation.ResourceIDs {
          if err := we.gpuController.StartWorkload(ctx, gpuID, config); err != nil {
              return fmt.Errorf("failed to start on GPU %s: %w", gpuID, err)
          }
      }
      
      return nil
  }
  
  func (we *WorkloadExecutor) monitorWorkload(ctx context.Context, workloadID string) {
      ticker := time.NewTicker(5 * time.Second)
      defer ticker.Stop()
      
      for {
          select {
          case <-ctx.Done():
              return
          case <-ticker.C:
              status, err := we.checkWorkloadStatus(ctx, workloadID)
              if err != nil {
                  log.Printf("Error checking workload %s: %v", workloadID, err)
                  continue
              }
              
              if status.IsCompleted {
                  we.handleWorkloadCompletion(ctx, workloadID, status)
                  return
              }
              
              if status.HasErrors {
                  we.handleWorkloadError(ctx, workloadID, status)
              }
          }
      }
  }
  ```

**2. Fast Workload Switching (Rust)**
- [ ] Implement sub-100ms workload switching:
  ```rust
  use std::time::Instant;
  
  pub struct WorkloadSwitcher {
      resource_controller: ResourceController,
      state_manager: StateManager,
      metrics_collector: MetricsCollector,
  }
  
  impl WorkloadSwitcher {
      pub async fn switch_workload(
          &self,
          resource_id: &str,
          from_workload: &str,
          to_workload: &str,
      ) -> Result<SwitchResult, Box<dyn std::error::Error>> {
          let start = Instant::now();
          
          // Phase 1: Pause current workload (10-20ms)
          self.pause_workload(resource_id, from_workload).await?;
          let pause_duration = start.elapsed();
          
          // Phase 2: Save checkpoint if needed (10-30ms)
          if self.needs_checkpoint(from_workload).await {
              self.save_checkpoint(resource_id, from_workload).await?;
          }
          let checkpoint_duration = start.elapsed() - pause_duration;
          
          // Phase 3: Switch context (20-40ms)
          self.switch_resource_context(resource_id, from_workload, to_workload).await?;
          let switch_duration = start.elapsed() - checkpoint_duration - pause_duration;
          
          // Phase 4: Start new workload (10-20ms)
          self.start_workload(resource_id, to_workload).await?;
          let total_duration = start.elapsed();
          
          // Record metrics
          self.metrics_collector.record_switch_duration(
              resource_id,
              total_duration.as_millis() as u64,
          ).await;
          
          Ok(SwitchResult {
              success: true,
              total_duration_ms: total_duration.as_millis() as u64,
              phases: PhaseDurations {
                  pause_ms: pause_duration.as_millis() as u64,
                  checkpoint_ms: checkpoint_duration.as_millis() as u64,
                  switch_ms: switch_duration.as_millis() as u64,
              },
          })
      }
      
      async fn pause_workload(
          &self,
          resource_id: &str,
          workload_id: &str,
      ) -> Result<(), Box<dyn std::error::Error>> {
          // Send pause signal to resource controller
          self.resource_controller.send_command(
              resource_id,
              ResourceCommand::Pause { workload_id: workload_id.to_string() },
          ).await?;
          
          // Wait for acknowledgment (with timeout)
          let timeout = tokio::time::Duration::from_millis(50);
          tokio::time::timeout(timeout, async {
              self.resource_controller.wait_for_status(
                  resource_id,
                  ResourceStatus::Paused,
              ).await
          }).await??;
          
          Ok(())
      }
      
      async fn switch_resource_context(
          &self,
          resource_id: &str,
          from_workload: &str,
          to_workload: &str,
      ) -> Result<(), Box<dyn std::error::Error>> {
          // Get new workload configuration
          let config = self.state_manager.get_workload_config(to_workload).await?;
          
          // Apply new configuration to resource
          self.resource_controller.configure_resource(
              resource_id,
              config,
          ).await?;
          
          // Update resource assignment
          self.state_manager.update_resource_assignment(
              resource_id,
              to_workload,
          ).await?;
          
          Ok(())
      }
      
      async fn start_workload(
          &self,
          resource_id: &str,
          workload_id: &str,
      ) -> Result<(), Box<dyn std::error::Error>> {
          // Send start signal
          self.resource_controller.send_command(
              resource_id,
              ResourceCommand::Start { workload_id: workload_id.to_string() },
          ).await?;
          
          // Verify workload is running
          let timeout = tokio::time::Duration::from_millis(50);
          tokio::time::timeout(timeout, async {
              self.resource_controller.wait_for_status(
                  resource_id,
                  ResourceStatus::Running,
              ).await
          }).await??;
          
          Ok(())
      }
  }
  
  #[derive(Debug)]
  pub struct SwitchResult {
      pub success: bool,
      pub total_duration_ms: u64,
      pub phases: PhaseDurations,
  }
  
  #[derive(Debug)]
  pub struct PhaseDurations {
      pub pause_ms: u64,
      pub checkpoint_ms: u64,
      pub switch_ms: u64,
  }
  ```

**3. Workload Preemption Support (Go)**
- [ ] Implement workload preemption for priority management:
  ```go
  package preemption
  
  type PreemptionManager struct {
      executor        *WorkloadExecutor
      priorityQueue   *PriorityQueue
      allocationEngine *AllocationEngine
      stateManager    *StateManager
  }
  
  func (pm *PreemptionManager) PreemptWorkload(
      ctx context.Context,
      highPriorityWorkloadID string,
  ) error {
      // Find workload to preempt
      candidate, err := pm.findPreemptionCandidate(ctx, highPriorityWorkloadID)
      if err != nil {
          return err
      }
      
      if candidate == nil {
          return fmt.Errorf("no suitable workload found for preemption")
      }
      
      log.Printf("Preempting workload %s (priority %d) for workload %s (priority %d)",
          candidate.ID, candidate.Priority, highPriorityWorkloadID, candidate.Priority-1)
      
      // Save checkpoint of preempted workload
      if err := pm.saveCheckpoint(ctx, candidate.ID); err != nil {
          return err
      }
      
      // Get allocation of candidate workload
      allocation, err := pm.allocationEngine.GetActiveAllocation(ctx, candidate.ID)
      if err != nil {
          return err
      }
      
      // Pause candidate workload
      if err := pm.executor.PauseWorkload(ctx, candidate.ID); err != nil {
          return err
      }
      
      // Update state
      pm.stateManager.TransitionState(ctx, candidate.ID, StatePaused)
      
      // Release resources
      if err := pm.allocationEngine.ReleaseResources(ctx, allocation.ID); err != nil {
          return err
      }
      
      // Requeue preempted workload
      if err := pm.priorityQueue.Enqueue(candidate); err != nil {
          return err
      }
      
      // Execute high priority workload on freed resources
      if err := pm.executor.ExecuteWorkload(ctx, highPriorityWorkloadID); err != nil {
          return err
      }
      
      return nil
  }
  
  func (pm *PreemptionManager) findPreemptionCandidate(
      ctx context.Context,
      highPriorityWorkloadID string,
  ) (*Workload, error) {
      // Get requirements of high priority workload
      highPriorityWorkload, err := pm.getWorkload(ctx, highPriorityWorkloadID)
      if err != nil {
          return nil, err
      }
      
      // Find running workloads with lower priority
      runningWorkloads, err := pm.getRunningWorkloads(ctx)
      if err != nil {
          return nil, err
      }
      
      var candidate *Workload
      for _, workload := range runningWorkloads {
          // Only preempt if:
          // 1. Lower priority
          // 2. Interruptible
          // 3. Has sufficient resources
          if workload.Priority > highPriorityWorkload.Priority &&
             workload.Requirements.Interruptible &&
             pm.hasCompatibleResources(workload, highPriorityWorkload) {
              candidate = workload
              break
          }
      }
      
      return candidate, nil
  }
  
  func (pm *PreemptionManager) saveCheckpoint(ctx context.Context, workloadID string) error {
      // Save workload state for later resumption
      checkpoint := Checkpoint{
          WorkloadID: workloadID,
          Timestamp:  time.Now(),
          State:      "paused",
      }
      
      return pm.checkpointRepo.Save(ctx, checkpoint)
  }
  ```

**4. GPU Controller Interface**
- [ ] Create controller for GPU operations:
  ```go
  package controller
  
  type GPUController struct {
      simulatorClient *GPUSimulatorClient
      metricsPublisher *MetricsPublisher
  }
  
  type GPUWorkloadConfig struct {
      WorkloadID  string
      ModelName   string
      BatchSize   int
      MaxLatency  int
      GPUIDs      []string
  }
  
  func (gc *GPUController) StartWorkload(
      ctx context.Context,
      gpuID string,
      config GPUWorkloadConfig,
  ) error {
      // Send command to GPU simulator
      req := StartWorkloadRequest{
          GPUID:      gpuID,
          WorkloadID: config.WorkloadID,
          Config: map[string]interface{}{
              "model_name":  config.ModelName,
              "batch_size":  config.BatchSize,
              "max_latency": config.MaxLatency,
          },
      }
      
      if err := gc.simulatorClient.StartWorkload(ctx, req); err != nil {
          return err
      }
      
      // Publish event
      gc.metricsPublisher.PublishEvent("gpu.workload.started", map[string]interface{}{
          "gpu_id":      gpuID,
          "workload_id": config.WorkloadID,
          "timestamp":   time.Now(),
      })
      
      return nil
  }
  
  func (gc *GPUController) StopWorkload(ctx context.Context, gpuID string, workloadID string) error {
      req := StopWorkloadRequest{
          GPUID:      gpuID,
          WorkloadID: workloadID,
      }
      
      return gc.simulatorClient.StopWorkload(ctx, req)
  }
  
  func (gc *GPUController) PauseWorkload(ctx context.Context, gpuID string, workloadID string) error {
      req := PauseWorkloadRequest{
          GPUID:      gpuID,
          WorkloadID: workloadID,
      }
      
      return gc.simulatorClient.PauseWorkload(ctx, req)
  }
  
  func (gc *GPUController) ResumeWorkload(ctx context.Context, gpuID string, workloadID string) error {
      req := ResumeWorkloadRequest{
          GPUID:      gpuID,
          WorkloadID: workloadID,
      }
      
      return gc.simulatorClient.ResumeWorkload(ctx, req)
  }
  ```

#### Deliverables
- [ ] Workload execution engine
- [ ] Sub-100ms workload switching capability
- [ ] Preemption and checkpoint support
- [ ] GPU and ASIC controllers
- [ ] Comprehensive execution tests
- [ ] Performance benchmarks

#### Success Criteria
- ✅ Workload execution initiated in <500ms
- ✅ Workload switching completed in <100ms (p95)
- ✅ Preemption occurs without data loss
- ✅ Checkpoint save/restore works correctly
- ✅ 99.9%+ successful workload executions

---

## Sprint 6: Monitoring & Observability - Metrics Collection

**Duration:** 2 weeks  
**Focus:** Prometheus, Grafana, metrics pipelines, alerting

### Objectives
- Deploy Prometheus + Thanos for multi-cluster monitoring
- Build Grafana dashboards for operations
- Implement metrics collection from all services
- Set up alert manager with PagerDuty integration

### Technical Implementation

#### 6.1 Prometheus + Thanos Setup

**Infrastructure (Kubernetes)**
```yaml
# monitoring/prometheus/values.yaml
prometheus:
  prometheusSpec:
    retention: 15d
    retentionSize: "50GB"
    storageSpec:
      volumeClaimTemplate:
        spec:
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 100Gi
    
    # Scrape configs
    additionalScrapeConfigs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
      
      - job_name: 'gpu-metrics'
        static_configs:
          - targets: ['gpu-exporter:9400']
      
      - job_name: 'asic-metrics'
        static_configs:
          - targets: ['asic-exporter:9401']

# Thanos for long-term storage
thanos:
  query:
    enabled: true
    replicaCount: 2
  
  storeGateway:
    enabled: true
    persistence:
      size: 10Gi
  
  compactor:
    enabled: true
    retentionResolutionRaw: 30d
    retentionResolution5m: 90d
    retentionResolution1h: 1y
  
  objectStorageConfig:
    type: s3
    config:
      bucket: mara-hcp-metrics
      endpoint: s3.amazonaws.com
```

#### 6.2 Custom Metrics Exporters

**GPU Metrics Exporter (Go)**
```go
package exporter

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
)

var (
    gpuUtilization = promauto.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "mara_gpu_utilization_percent",
            Help: "GPU utilization percentage",
        },
        []string{"gpu_id", "facility_id", "model"},
    )
    
    gpuTemperature = promauto.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "mara_gpu_temperature_celsius",
            Help: "GPU temperature in Celsius",
        },
        []string{"gpu_id", "facility_id"},
    )
    
    gpuPowerDraw = promauto.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "mara_gpu_power_watts",
            Help: "GPU power draw in watts",
        },
        []string{"gpu_id", "facility_id"},
    )
    
    gpuMemoryUsed = promauto.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "mara_gpu_memory_used_bytes",
            Help: "GPU memory used in bytes",
        },
        []string{"gpu_id", "facility_id"},
    )
    
    workloadThroughput = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "mara_workload_requests_total",
            Help: "Total number of workload requests processed",
        },
        []string{"workload_id", "workload_type", "status"},
    )
    
    workloadLatency = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "mara_workload_latency_seconds",
            Help:    "Workload request latency in seconds",
            Buckets: prometheus.ExponentialBuckets(0.001, 2, 15), // 1ms to ~32s
        },
        []string{"workload_id", "workload_type"},
    )
)

type GPUMetricsExporter struct {
    gpuSimClient *GPUSimulatorClient
}

func (e *GPUMetricsExporter) CollectMetrics(ctx context.Context) error {
    // Get GPU metrics from simulator
    gpus, err := e.gpuSimClient.GetAllGPUs(ctx)
    if err != nil {
        return err
    }
    
    for _, gpu := range gpus {
        gpuUtilization.WithLabelValues(
            gpu.ID,
            gpu.FacilityID,
            gpu.Model,
        ).Set(gpu.Utilization)
        
        gpuTemperature.WithLabelValues(
            gpu.ID,
            gpu.FacilityID,
        ).Set(float64(gpu.Temperature))
        
        gpuPowerDraw.WithLabelValues(
            gpu.ID,
            gpu.FacilityID,
        ).Set(float64(gpu.PowerDraw))
        
        gpuMemoryUsed.WithLabelValues(
            gpu.ID,
            gpu.FacilityID,
        ).Set(float64(gpu.MemoryUsed))
    }
    
    return nil
}

func (e *GPUMetricsExporter) Start(ctx context.Context) {
    ticker := time.NewTicker(15 * time.Second)
    defer ticker.Stop()
    
    for {
        select {
        case <-ctx.Done():
            return
        case <-ticker.C:
            if err := e.CollectMetrics(ctx); err != nil {
                log.Printf("Error collecting GPU metrics: %v", err)
            }
        }
    }
}
```

**ASIC Metrics Exporter (Go)**
```go
package exporter

var (
    asicHashRate = promauto.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "mara_asic_hashrate_ths",
            Help: "ASIC hash rate in TH/s",
        },
        []string{"asic_id", "facility_id", "model"},
    )
    
    asicPowerConsumption = promauto.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "mara_asic_power_watts",
            Help: "ASIC power consumption in watts",
        },
        []string{"asic_id", "facility_id"},
    )
    
    asicEfficiency = promauto.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "mara_asic_efficiency_j_th",
            Help: "ASIC efficiency in J/TH",
        },
        []string{"asic_id", "facility_id", "model"},
    )
    
    miningRevenue = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "mara_mining_revenue_usd",
            Help: "Total mining revenue in USD",
        },
        []string{"facility_id", "pool"},
    )
)

type ASICMetricsExporter struct {
    asicSimClient *ASICSimulatorClient
}

func (e *ASICMetricsExporter) CollectMetrics(ctx context.Context) error {
    asics, err := e.asicSimClient.GetAllASICs(ctx)
    if err != nil {
        return err
    }
    
    for _, asic := range asics {
        asicHashRate.WithLabelValues(
            asic.ID,
            asic.FacilityID,
            asic.Model,
        ).Set(asic.HashRate)
        
        asicPowerConsumption.WithLabelValues(
            asic.ID,
            asic.FacilityID,
        ).Set(float64(asic.PowerDraw))
        
        asicEfficiency.WithLabelValues(
            asic.ID,
            asic.FacilityID,
            asic.Model,
        ).Set(asic.Efficiency)
        
        if asic.IsMining {
            miningRevenue.WithLabelValues(
                asic.FacilityID,
                asic.Pool,
            ).Add(asic.RevenueLastInterval)
        }
    }
    
    return nil
}
```

#### 6.3 Grafana Dashboards

**Executive Dashboard (JSON)**
```json
{
  "dashboard": {
    "title": "MARA HCP - Executive Dashboard",
    "tags": ["executive", "overview"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Total Revenue (24h)",
        "type": "stat",
        "gridPos": {"h": 6, "w": 6, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "sum(increase(mara_revenue_usd_total[24h]))",
            "legendFormat": "Revenue"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "currencyUSD",
            "color": {"mode": "thresholds"},
            "thresholds": {
              "steps": [
                {"value": 0, "color": "red"},
                {"value": 50000, "color": "yellow"},
                {"value": 100000, "color": "green"}
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "Overall Utilization",
        "type": "gauge",
        "gridPos": {"h": 6, "w": 6, "x": 6, "y": 0},
        "targets": [
          {
            "expr": "avg(mara_gpu_utilization_percent)",
            "legendFormat": "GPU Utilization"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percent",
            "min": 0,
            "max": 100,
            "thresholds": {
              "steps": [
                {"value": 0, "color": "red"},
                {"value": 70, "color": "yellow"},
                {"value": 85, "color": "green"}
              ]
            }
          }
        }
      },
      {
        "id": 3,
        "title": "Active Workloads",
        "type": "stat",
        "gridPos": {"h": 6, "w": 6, "x": 12, "y": 0},
        "targets": [
          {
            "expr": "count(mara_workload_status{status=\"running\"})",
            "legendFormat": "Active"
          }
        ]
      },
      {
        "id": 4,
        "title": "GPU Utilization by Facility",
        "type": "timeseries",
        "gridPos": {"h": 8, "w": 24, "x": 0, "y": 6},
        "targets": [
          {
            "expr": "avg(mara_gpu_utilization_percent) by (facility_id)",
            "legendFormat": "{{facility_id}}"
          }
        ]
      },
      {
        "id": 5,
        "title": "Workload Throughput",
        "type": "timeseries",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 14},
        "targets": [
          {
            "expr": "sum(rate(mara_workload_requests_total[5m])) by (workload_type)",
            "legendFormat": "{{workload_type}}"
          }
        ]
      },
      {
        "id": 6,
        "title": "Workload Latency (p95)",
        "type": "timeseries",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 14},
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(mara_workload_latency_seconds_bucket[5m])) by (le, workload_type))",
            "legendFormat": "{{workload_type}} p95"
          }
        ]
      }
    ]
  }
}
```

#### 6.4 Alert Rules

**Prometheus Alert Rules**
```yaml
# monitoring/alerts/gpu-alerts.yaml
groups:
  - name: gpu_alerts
    interval: 30s
    rules:
      - alert: GPUHighTemperature
        expr: mara_gpu_temperature_celsius > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "GPU {{ $labels.gpu_id }} high temperature"
          description: "GPU {{ $labels.gpu_id }} at {{ $value }}°C for 5 minutes"
      
      - alert: GPUCriticalTemperature
        expr: mara_gpu_temperature_celsius > 85
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "GPU {{ $labels.gpu_id }} critical temperature"
          description: "GPU {{ $labels.gpu_id }} at {{ $value }}°C - immediate action required"
      
      - alert: GPUHighPowerDraw
        expr: mara_gpu_power_watts > 700
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "GPU {{ $labels.gpu_id }} high power draw"
          description: "GPU {{ $labels.gpu_id }} drawing {{ $value }}W"
      
      - alert: GPULowUtilization
        expr: avg_over_time(mara_gpu_utilization_percent[1h]) < 20
        for: 30m
        labels:
          severity: info
        annotations:
          summary: "GPU {{ $labels.gpu_id }} underutilized"
          description: "GPU {{ $labels.gpu_id }} at {{ $value }}% utilization - consider reallocation"

  - name: workload_alerts
    interval: 30s
    rules:
      - alert: HighWorkloadFailureRate
        expr: |
          sum(rate(mara_workload_requests_total{status="failed"}[5m]))
          /
          sum(rate(mara_workload_requests_total[5m]))
          > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High workload failure rate"
          description: "{{ $value | humanizePercentage }} of workloads failing"
      
      - alert: WorkloadLatencyHigh
        expr: |
          histogram_quantile(0.95,
            sum(rate(mara_workload_latency_seconds_bucket[5m])) by (le, workload_type)
          ) > 1.0
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High workload latency for {{ $labels.workload_type }}"
          description: "p95 latency {{ $value }}s exceeds 1s threshold"
      
      - alert: WorkloadQueueBacklog
        expr: mara_workload_queue_depth > 100
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Large workload queue backlog"
          description: "{{ $value }} workloads queued for 15+ minutes"

  - name: system_alerts
    interval: 30s
    rules:
      - alert: ServiceDown
        expr: up{job=~".*-service"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
          description: "{{ $labels.job }} has been down for 2 minutes"
      
      - alert: HighMemoryUsage
        expr: |
          (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)
          / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage at {{ $value | humanizePercentage }}"
```

#### 6.5 AlertManager Configuration

**AlertManager with PagerDuty Integration**
```yaml
# monitoring/alertmanager/config.yaml
global:
  resolve_timeout: 5m
  pagerduty_url: 'https://events.pagerduty.com/v2/enqueue'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  
  routes:
    # Critical alerts go to PagerDuty
    - match:
        severity: critical
      receiver: pagerduty-critical
      continue: true
    
    # Warning alerts go to Slack
    - match:
        severity: warning
      receiver: slack-warnings
    
    # Info alerts go to Slack only
    - match:
        severity: info
      receiver: slack-info

receivers:
  - name: 'default'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#mara-hcp-alerts'
        title: 'MARA HCP Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
  
  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: '${PAGERDUTY_SERVICE_KEY}'
        severity: 'critical'
        description: '{{ .GroupLabels.alertname }}'
        details:
          firing: '{{ .Alerts.Firing | len }}'
          resolved: '{{ .Alerts.Resolved | len }}'
  
  - name: 'slack-warnings'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#mara-hcp-warnings'
        color: 'warning'
  
  - name: 'slack-info'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#mara-hcp-info'
        color: 'good'

inhibit_rules:
  # Inhibit info alerts if critical alert is firing
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'info'
    equal: ['alertname', 'cluster', 'service']
```

#### Deliverables
- [ ] Prometheus + Thanos deployment
- [ ] GPU and ASIC metrics exporters
- [ ] 5+ Grafana dashboards (Executive, Operations, GPU, Workload, Billing)
- [ ] 15+ alert rules
- [ ] AlertManager with PagerDuty/Slack integration
- [ ] Metrics retention and archival strategy

#### Success Criteria
- ✅ All services exposing Prometheus metrics
- ✅ Metrics scraped every 15s
- ✅ Dashboards update in real-time (<5s lag)
- ✅ Critical alerts trigger within 1 minute
- ✅ 99.9%+ metrics collection uptime
- ✅ 30-day retention on raw metrics
- ✅ 1-year retention on aggregated metrics

---

## Sprint 7: Monitoring & Observability - Logging & Tracing

**Duration:** 2 weeks  
**Focus:** ELK Stack, Jaeger, distributed tracing, log aggregation

### Objectives
- Deploy Elasticsearch + Fluentd + Kibana
- Implement distributed tracing with Jaeger
- Build log aggregation pipelines
- Create log analysis dashboards

### Technical Implementation

#### 7.1 ELK Stack Deployment

**Elasticsearch Configuration**
```yaml
# logging/elasticsearch/values.yaml
elasticsearch:
  replicas: 3
  minimumMasterNodes: 2
  
  esJavaOpts: "-Xmx4g -Xms4g"
  
  resources:
    requests:
      cpu: "2000m"
      memory: "6Gi"
    limits:
      cpu: "4000m"
      memory: "8Gi"
  
  volumeClaimTemplate:
    accessModes: ["ReadWriteOnce"]
    resources:
      requests:
        storage: 500Gi
  
  esConfig:
    elasticsearch.yml: |
      cluster.name: "mara-hcp-logs"
      network.host: 0.0.0.0
      
      # Index lifecycle management
      xpack.ilm.enabled: true
      
      # Security
      xpack.security.enabled: true
      xpack.security.transport.ssl.enabled: true
```

**Fluentd Configuration**
```yaml
# logging/fluentd/fluentd.conf
<source>
  @type tail
  path /var/log/containers/*.log
  pos_file /var/log/fluentd-containers.log.pos
  tag kubernetes.*
  read_from_head true
  <parse>
    @type json
    time_format %Y-%m-%dT%H:%M:%S.%NZ
  </parse>
</source>

# Parse Kubernetes metadata
<filter kubernetes.**>
  @type kubernetes_metadata
  @id filter_kube_metadata
</filter>

# Enrich with custom fields
<filter kubernetes.**>
  @type record_transformer
  <record>
    cluster_name "mara-hcp-prod"
    environment "production"
  </record>
</filter>

# Route by log level
<match kubernetes.**>
  @type rewrite_tag_filter
  <rule>
    key log
    pattern /ERROR|FATAL/
    tag error.${tag}
  </rule>
  <rule>
    key log
    pattern /WARN/
    tag warn.${tag}
  </rule>
  <rule>
    key log
    pattern /.*/
    tag info.${tag}
  </rule>
</match>

# Send to Elasticsearch
<match **>
  @type elasticsearch
  host elasticsearch-master
  port 9200
  logstash_format true
  logstash_prefix mara-hcp
  
  <buffer>
    @type file
    path /var/log/fluentd-buffers/kubernetes.system.buffer
    flush_mode interval
    retry_type exponential_backoff
    flush_thread_count 2
    flush_interval 5s
    retry_forever false
    retry_max_interval 30
    chunk_limit_size 2M
    queue_limit_length 8
    overflow_action block
  </buffer>
</match>
```

#### 7.2 Structured Logging in Services

**Go Service Logging**
```go
package logging

import (
    "go.uber.org/zap"
    "go.uber.org/zap/zapcore"
)

func NewLogger(serviceName string) (*zap.Logger, error) {
    config := zap.NewProductionConfig()
    
    // JSON output for Fluentd parsing
    config.Encoding = "json"
    
    // Custom time format
    config.EncoderConfig.TimeKey = "timestamp"
    config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
    
    // Add service name to all logs
    config.InitialFields = map[string]interface{}{
        "service": serviceName,
        "version": os.Getenv("APP_VERSION"),
    }
    
    logger, err := config.Build()
    if err != nil {
        return nil, err
    }
    
    return logger, nil
}

// Usage in services
func (s *WorkloadRouter) RouteWorkload(ctx context.Context, workloadID string) error {
    logger := s.logger.With(
        zap.String("workload_id", workloadID),
        zap.String("trace_id", trace.FromContext(ctx).SpanContext().TraceID().String()),
    )
    
    logger.Info("routing workload",
        zap.String("workload_type", workload.Type),
        zap.Int("resource_count", len(resources)),
    )
    
    // Business logic...
    
    logger.Info("workload routed successfully",
        zap.Duration("routing_duration", time.Since(start)),
        zap.Strings("target_resources", resourceIDs),
    )
    
    return nil
}
```

#### 7.3 Distributed Tracing with Jaeger

**Jaeger Setup**
```yaml
# tracing/jaeger/values.yaml
provisionDataStore:
  cassandra: false
  elasticsearch: true

storage:
  type: elasticsearch
  elasticsearch:
    host: elasticsearch-master
    port: 9200
    indexPrefix: jaeger

query:
  replicaCount: 2
  service:
    type: LoadBalancer

collector:
  replicaCount: 3
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
  
  sampling:
    strategies: |
      {
        "service_strategies": [
          {
            "service": "workload-router",
            "type": "probabilistic",
            "param": 1.0
          },
          {
            "service": "resource-manager",
            "type": "probabilistic",
            "param": 1.0
          },
          {
            "service": "orchestrator",
            "type": "probabilistic",
            "param": 0.5
          }
        ],
        "default_strategy": {
          "type": "probabilistic",
          "param": 0.1
        }
      }
```

**Tracing in Go Services**
```go
package tracing

import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/jaeger"
    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

func InitTracer(serviceName string) (*sdktrace.TracerProvider, error) {
    exporter, err := jaeger.New(
        jaeger.WithCollectorEndpoint(
            jaeger.WithEndpoint("http://jaeger-collector:14268/api/traces"),
        ),
    )
    if err != nil {
        return nil, err
    }
    
    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(exporter),
        sdktrace.WithResource(resource.NewWithAttributes(
            semconv.SchemaURL,
            semconv.ServiceNameKey.String(serviceName),
            semconv.ServiceVersionKey.String(os.Getenv("APP_VERSION")),
        )),
        sdktrace.WithSampler(sdktrace.AlwaysSample()),
    )
    
    otel.SetTracerProvider(tp)
    
    return tp, nil
}

// Usage in HTTP handlers
func (s *Server) HandleWorkloadSubmit(w http.ResponseWriter, r *http.Request) {
    ctx, span := otel.Tracer("workload-api").Start(r.Context(), "SubmitWorkload")
    defer span.End()
    
    var req WorkloadRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, "invalid request")
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    span.SetAttributes(
        attribute.String("workload.type", req.Type),
        attribute.Int("workload.resource_count", req.ResourceCount),
    )
    
    // Route workload (creates child span)
    routing, err := s.router.RouteWorkload(ctx, &req)
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, "routing failed")
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    span.SetAttributes(
        attribute.StringSlice("routing.target_resources", routing.TargetResources),
        attribute.String("routing.facility_id", routing.FacilityID),
    )
    
    span.SetStatus(codes.Ok, "workload submitted successfully")
    w.WriteHeader(http.StatusOK)
}

// Workload Router with tracing
func (wr *WorkloadRouter) RouteWorkload(ctx context.Context, req *WorkloadRequest) (*RoutingDecision, error) {
    ctx, span := otel.Tracer("workload-router").Start(ctx, "RouteWorkload")
    defer span.End()
    
    // Classify workload
    ctx, classifySpan := otel.Tracer("workload-router").Start(ctx, "ClassifyWorkload")
    classification := wr.classifier.Classify(req)
    classifySpan.SetAttributes(
        attribute.String("classification.priority", classification.Priority),
        attribute.String("classification.tier", classification.Tier),
    )
    classifySpan.End()
    
    // Find available resources
    ctx, resourceSpan := otel.Tracer("workload-router").Start(ctx, "FindResources")
    resources, err := wr.resourceManager.FindAvailable(ctx, req.ResourceRequirements)
    if err != nil {
        resourceSpan.RecordError(err)
        resourceSpan.End()
        span.RecordError(err)
        return nil, err
    }
    resourceSpan.SetAttributes(
        attribute.Int("resources.found", len(resources)),
    )
    resourceSpan.End()
    
    // Make routing decision
    decision := wr.makeRoutingDecision(classification, resources)
    
    span.SetAttributes(
        attribute.String("decision.facility_id", decision.FacilityID),
        attribute.Int("decision.resource_count", len(decision.TargetResources)),
    )
    
    return decision, nil
}
```

#### 7.4 Kibana Dashboards

**Index Patterns and Visualizations**
```json
{
  "objects": [
    {
      "type": "index-pattern",
      "id": "mara-hcp-*",
      "attributes": {
        "title": "mara-hcp-*",
        "timeFieldName": "@timestamp"
      }
    },
    {
      "type": "visualization",
      "id": "error-rate-by-service",
      "attributes": {
        "title": "Error Rate by Service",
        "visState": {
          "type": "line",
          "params": {
            "type": "line",
            "grid": {"categoryLines": false},
            "categoryAxes": [{"id": "CategoryAxis-1", "type": "category", "position": "bottom", "show": true}],
            "valueAxes": [{"id": "ValueAxis-1", "name": "LeftAxis-1", "type": "value", "position": "left", "show": true}],
            "seriesParams": [{"show": "true", "type": "line", "mode": "normal", "data": {"label": "Count", "id": "1"}}]
          },
          "aggs": [
            {"id": "1", "enabled": true, "type": "count", "schema": "metric"},
            {"id": "2", "enabled": true, "type": "date_histogram", "schema": "segment", "params": {"field": "@timestamp", "interval": "auto"}},
            {"id": "3", "enabled": true, "type": "terms", "schema": "group", "params": {"field": "kubernetes.labels.app.keyword", "size": 10}}
          ]
        },
        "uiStateJSON": "{}",
        "description": "",
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": {
            "index": "mara-hcp-*",
            "filter": [{"query": {"match": {"log.level": {"query": "ERROR", "type": "phrase"}}}}],
            "query": {"query": "", "language": "kuery"}
          }
        }
      }
    }
  ]
}
```

#### Deliverables
- [ ] ELK stack deployment (Elasticsearch, Fluentd, Kibana)
- [ ] Jaeger distributed tracing
- [ ] Structured logging in all services
- [ ] 5+ Kibana dashboards
- [ ] Log retention and archival policies
- [ ] Trace sampling configuration

#### Success Criteria
- ✅ All service logs aggregated in Elasticsearch
- ✅ Log search latency <1s for recent logs
- ✅ Distributed traces for 100% of requests
- ✅ Trace visualization in Jaeger UI
- ✅ 7-day retention for detailed logs
- ✅ 30-day retention for error logs
- ✅ 90-day retention for audit logs

---

## Sprint 8: Customer Portal - Frontend Foundation & Design System

**Duration:** 2 weeks  
**Focus:** React UI, Material Design 3, design system implementation, Figma/Sketch setup

### Objectives
- Set up React 18 + TypeScript + Material-UI v5 frontend
- Implement design system from `design-system-and-ux.md`
- Create Figma/Sketch design files with complete component library
- Build core authentication (Login/Register)
- Implement responsive layout and navigation

### Design System Reference
**See `/Users/sdixit/Documents/MARA/design-system-and-ux.md` for:**
- Complete Material Design 3 specifications
- Color palette and typography
- Component library (buttons, cards, forms, charts)
- 13 screen mockups (Login, Register, Dashboard, Resources, Workloads, Billing, Settings, etc.)
- Mobile views and responsive breakpoints
- Accessibility standards (WCAG 2.1 AA)

### Technical Implementation

#### 8.1 Frontend Project Setup

**Project Structure**
```bash
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── AppBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── charts/
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   └── GaugeChart.tsx
│   │   └── dashboard/
│   │       ├── KPICard.tsx
│   │       ├── WorkloadTable.tsx
│   │       └── ResourceHeatMap.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Resources.tsx
│   │   ├── Workloads.tsx
│   │   ├── Billing.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWebSocket.ts
│   │   └── useNotifications.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── websocket.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── workloadSlice.ts
│   │   │   └── resourceSlice.ts
│   │   └── store.ts
│   ├── theme/
│   │   ├── theme.ts
│   │   ├── palette.ts
│   │   └── typography.ts
│   ├── types/
│   │   ├── workload.ts
│   │   ├── resource.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── routes.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

**package.json**
```json
{
  "name": "mara-hcp-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@mui/x-charts": "^6.19.0",
    "@mui/x-data-grid": "^6.19.0",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "recharts": "^2.10.3",
    "axios": "^1.6.4",
    "socket.io-client": "^4.6.1",
    "date-fns": "^3.0.6",
    "zod": "^3.22.4",
    "react-hook-form": "^7.49.2",
    "@hookform/resolvers": "^3.3.3",
    "react-query": "^3.39.3",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.47",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "@typescript-eslint/parser": "^6.18.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.1.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.11",
    "vite-plugin-pwa": "^0.17.4",
    "vitest": "^1.1.3"
  }
}
```

#### 8.2 Theme Implementation (Material Design 3)

**theme/theme.ts**
```typescript
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Colors from design-system-and-ux.md
const palette = {
  mode: 'dark' as const,
  primary: {
    main: '#3B82F6',      // Blue 500
    light: '#60A5FA',     // Blue 400
    dark: '#2563EB',      // Blue 600
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#8B5CF6',      // Violet 500
    light: '#A78BFA',     // Violet 400
    dark: '#7C3AED',      // Violet 600
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10B981',      // Emerald 500
    light: '#34D399',     // Emerald 400
    dark: '#059669',      // Emerald 600
  },
  warning: {
    main: '#F59E0B',      // Amber 500
    light: '#FBBF24',     // Amber 400
    dark: '#D97706',      // Amber 600
  },
  error: {
    main: '#EF4444',      // Red 500
    light: '#F87171',     // Red 400
    dark: '#DC2626',      // Red 600
  },
  background: {
    default: '#0A0A0A',
    paper: '#1A1A1A',
  },
  text: {
    primary: '#F5F5F5',
    secondary: '#A0A0A0',
    disabled: '#6B7280',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
};

const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none' as const,
    fontWeight: 500,
  },
};

const themeOptions: ThemeOptions = {
  palette,
  typography,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A1A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#3B82F6',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
```

#### 8.3 Figma/Sketch Design System Setup

**Design File Structure**
```
MARA-HCP-Design-System.fig
├── 📁 Cover & Documentation
│   └── Design System Overview
│
├── 📁 Foundation
│   ├── Colors
│   │   ├── Primary Colors
│   │   ├── Semantic Colors
│   │   ├── Status Colors
│   │   └── Gray Scale
│   ├── Typography
│   │   ├── Font Scales
│   │   ├── Heading Styles
│   │   └── Body Styles
│   ├── Spacing
│   │   └── 8px Grid System
│   ├── Elevation
│   │   └── Shadow Levels (0-24)
│   └── Icons
│       └── Material Icons Library
│
├── 📁 Components
│   ├── Buttons
│   │   ├── Primary Button (Default, Hover, Active, Disabled)
│   │   ├── Secondary Button
│   │   ├── Text Button
│   │   └── Icon Button
│   ├── Forms
│   │   ├── Text Input (Normal, Focused, Error, Disabled)
│   │   ├── Select Dropdown
│   │   ├── Checkbox
│   │   ├── Radio Button
│   │   ├── Toggle Switch
│   │   └── Date Picker
│   ├── Data Display
│   │   ├── KPI Card
│   │   ├── Status Badge
│   │   ├── Progress Bar
│   │   ├── Data Table
│   │   └── Stat Card
│   ├── Navigation
│   │   ├── Top App Bar
│   │   ├── Side Navigation
│   │   ├── Tabs
│   │   ├── Breadcrumbs
│   │   └── Command Palette
│   ├── Feedback
│   │   ├── Toast Notification
│   │   ├── Alert Banner
│   │   ├── Modal Dialog
│   │   ├── Loading Skeleton
│   │   └── Empty State
│   └── Charts
│       ├── Line Chart
│       ├── Bar Chart
│       ├── Gauge Chart
│       └── Heat Map
│
├── 📁 Patterns
│   ├── Dashboard Layouts
│   │   ├── Executive Dashboard
│   │   └── Operations Dashboard
│   ├── List Views
│   │   ├── Resource List
│   │   └── Workload List
│   └── Detail Views
│       ├── Resource Detail
│       └── Workload Detail
│
└── 📁 Screens (Complete Mockups)
    ├── Authentication
    │   ├── Login
    │   └── Register
    ├── Dashboard
    │   ├── Executive View
    │   └── Operations View
    ├── Resources
    │   ├── Resource Browser
    │   └── Resource Detail
    ├── Workloads
    │   ├── Workload List
    │   ├── Workload Detail
    │   └── Submit Workload Modal
    ├── Billing
    │   └── Billing Dashboard
    ├── Settings
    │   ├── Profile
    │   ├── API Keys
    │   └── Team Management
    └── Mobile
        ├── Mobile Dashboard
        └── Mobile Navigation
```

**Figma Setup Instructions**
```markdown
# Figma Design System Setup Guide

## 1. Create New Figma File
- File name: "MARA HCP - Design System v1.0"
- Set canvas background to #0A0A0A (dark mode)

## 2. Setup Color Styles
Create color styles for all palette colors:
- Primary/Main: #3B82F6
- Primary/Light: #60A5FA
- Primary/Dark: #2563EB
- Success/Main: #10B981
- Warning/Main: #F59E0B
- Error/Main: #EF4444
- Background/Default: #0A0A0A
- Background/Paper: #1A1A1A
- Text/Primary: #F5F5F5
- Text/Secondary: #A0A0A0

## 3. Setup Text Styles
- H1: Inter, 40px, Bold, -0.02em
- H2: Inter, 32px, Semibold, -0.01em
- H3: Inter, 24px, Semibold
- H4: Inter, 20px, Semibold
- Body 1: Inter, 16px, Regular
- Body 2: Inter, 14px, Regular
- Caption: Inter, 12px, Regular

## 4. Create Component Library
Build components as Figma components with variants:
- All buttons with states (default, hover, pressed, disabled)
- All form elements with states
- All data display components
- Navigation components

## 5. Setup Auto Layout
- Use Auto Layout for all components
- 8px spacing grid system
- Padding: 8, 12, 16, 24, 32px

## 6. Create Screen Templates
Use complete mockups from design-system-and-ux.md:
- Import all 13 screen designs
- Make them responsive with constraints
- Add interactions for prototype

## 7. Documentation
- Add description to each component
- Document spacing, sizing rules
- Include code snippets from design-system-and-ux.md

## 8. Sharing & Handoff
- Publish library for team access
- Enable Developer Mode
- Export assets for development
```

#### 8.4 Login & Register Pages

**pages/Login.tsx**
```typescript
import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginIcon } from '@mui/icons-material';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithSSO } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async () => {
    try {
      await loginWithSSO();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'SSO login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MARA HCP
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Hybrid Compute Platform
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Remember me"
                />
                <Link href="/forgot-password" underline="hover">
                  Forgot password?
                </Link>
              </Box>

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={<LoginIcon />}
                sx={{ mb: 2 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={handleSSOLogin}
              startIcon={<LoginIcon />}
            >
              Sign in with SSO
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="/register" underline="hover">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 4 }}
        >
          © 2025 MARA Holdings. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
```

**pages/Register.tsx**
```typescript
import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    fullName: '',
    password: '',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation
  const passwordRequirements: PasswordRequirement[] = [
    {
      text: 'At least 8 characters',
      met: formData.password.length >= 8,
    },
    {
      text: 'One uppercase letter',
      met: /[A-Z]/.test(formData.password),
    },
    {
      text: 'One number',
      met: /[0-9]/.test(formData.password),
    },
    {
      text: 'One special character',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms & Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Your Account
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Work Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                margin="normal"
                required
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                margin="normal"
                required
                autoComplete="name"
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                margin="normal"
                required
                autoComplete="new-password"
              />

              {formData.password && (
                <List dense sx={{ mt: 1 }}>
                  {passwordRequirements.map((req, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {req.met ? (
                          <CheckCircle color="success" fontSize="small" />
                        ) : (
                          <Cancel color="disabled" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={req.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: req.met ? 'success.main' : 'text.secondary',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank">
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link href="/privacy" target="_blank">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ mt: 2, mb: 3 }}
              />

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loading || !isPasswordValid || !agreeToTerms}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link href="/login" underline="hover">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
```

#### Deliverables
- [ ] React 18 + TypeScript + Vite project setup
- [ ] Material-UI v5 theme implementation
- [ ] Complete Figma/Sketch design system file
- [ ] Component library (20+ reusable components)
- [ ] Login and Register pages
- [ ] Responsive layout foundation
- [ ] PWA configuration
- [ ] Design system documentation

#### Success Criteria
- ✅ All designs match `design-system-and-ux.md` specifications
- ✅ Figma file with 50+ components and 13 screens
- ✅ Dark mode implementation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ <100ms button interactions
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ PWA manifest and service worker configured

---

