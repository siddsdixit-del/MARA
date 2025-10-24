# MARA Hybrid Compute Platform (HCP)

**Version**: 1.0  
**Status**: Development  
**Architecture**: Microservices with Event-Driven Architecture

---

## 🚀 Overview

The MARA Hybrid Compute Platform is a cloud-native orchestration system that dynamically allocates computational resources between Bitcoin mining and AI inference workloads based on real-time economic signals.

### Key Features
- **Dynamic Resource Allocation**: Sub-100ms workload switching between Bitcoin mining and AI inference
- **Economic Optimization**: Real-time profitability calculations based on electricity prices, BTC price, and GPU spot rates
- **Intelligent Workload Routing**: Multi-level priority queue with fairness guarantees
- **Comprehensive Monitoring**: Prometheus + Grafana + ELK + Jaeger for full observability
- **Simulation-First Development**: Complete hardware simulators for local development without physical infrastructure

### Target Scale
- **50,000+ GPUs** and **250,000+ ASICs**
- **99.99% uptime** with <50ms API latency (p50)
- **SOC 2 Type II** and **ISO 27001** compliance

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentation](#-documentation)

---

## ⚡ Quick Start

### Prerequisites

- Docker Desktop 4.0+ (or Docker Engine 24.0+ with Docker Compose v2)
- Go 1.21+ (for backend services development)
- Python 3.12+ (for ML services and simulators)
- Node.js 18+ (for frontend development)
- Make (for convenience commands)

### 1. Clone and Setup

```bash
cd /Users/sdixit/Documents/MARA/mara-hcp

# Setup entire development environment
make setup
```

This will:
- Pull all Docker images
- Start infrastructure services (PostgreSQL, TimescaleDB, Redis, MongoDB, Neo4j, Kafka, Prometheus, Grafana, Kong, Consul, Vault)
- Initialize databases with schemas
- Setup monitoring and API gateway

### 2. Verify Installation

```bash
# Check health of all services
make health

# View logs
make logs
```

### 3. Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana | http://localhost:3000 | admin / admin |
| Prometheus | http://localhost:9090 | - |
| Kong Admin API | http://localhost:8001 | - |
| Kong Proxy | http://localhost:8000 | - |
| Consul UI | http://localhost:8500 | - |
| Vault | http://localhost:8200 | Token: dev-token |
| Neo4j Browser | http://localhost:7474 | neo4j / dev_password |

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                     │
│                    (Web Portal, Mobile, API)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Kong)                        │
│              Rate Limiting, Auth, Routing                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐
│ Orchestrator │ │ Optimizer│ │ Router  │ │   Resource   │
│   Service    │ │ Service  │ │ Service │ │   Manager    │
└──────┬───────┘ └────┬─────┘ └────┬────┘ └──────┬───────┘
       │              │            │             │
       └──────────────┴────────────┴─────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Message Bus (Kafka)                      │
└─────────────────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐
│  PostgreSQL  │ │TimescaleDB│ │  Redis  │ │   MongoDB    │
│  (Metadata)  │ │ (Metrics) │ │ (Cache) │ │ (Audit Logs) │
└──────────────┘ └───────────┘ └─────────┘ └──────────────┘
```

### Core Components

1. **Orchestrator Service** (Go): Central coordination and workload lifecycle management
2. **Economic Optimizer** (Go + Python): Real-time profitability calculations
3. **Workload Router** (Go): Intelligent routing with multi-level priority queuing
4. **Resource Manager** (Rust): High-performance resource allocation and health monitoring
5. **Billing Service** (Go): Usage metering and cost calculation
6. **ML Services** (Python): Predictive models and anomaly detection

### Simulators

For local development without physical hardware:

- **GPU Simulator** (Python): Simulates NVIDIA H100 GPUs with realistic metrics
- **ASIC Simulator** (Python): Simulates Bitcoin mining ASICs
- **Market Data Simulator** (Python): Generates realistic price feeds
- **Grid Simulator** (Python): Simulates ERCOT grid signals

---

## 🛠️ Technology Stack

### Backend
- **Languages**: Go 1.21+, Python 3.12+, Rust 1.75+
- **API**: gRPC (internal), REST (external), GraphQL (dashboard)
- **Frameworks**: Gin (Go), FastAPI (Python), Actix-Web (Rust)

### Data Layer
- **PostgreSQL 15**: Operational database (OLTP)
- **TimescaleDB**: Time-series metrics
- **Redis 7.2**: Distributed cache and session management
- **MongoDB 7.0**: Audit logs
- **Neo4j 5.0**: Resource relationships and network topology
- **Apache Kafka 3.5**: Event streaming

### Infrastructure
- **Docker 24+**: Containerization
- **Kubernetes 1.28+**: Orchestration (production)
- **Kong**: API Gateway
- **Consul**: Service discovery
- **Vault**: Secret management
- **Terraform**: Infrastructure as Code

### Monitoring & Observability
- **Prometheus + Thanos**: Metrics collection and long-term storage
- **Grafana**: Dashboards and visualization
- **Elasticsearch + Fluentd + Kibana**: Log aggregation
- **Jaeger**: Distributed tracing
- **DataDog**: APM (production)

### Frontend
- **React 18 + TypeScript 5**: UI framework
- **Material-UI v5**: Component library
- **Redux Toolkit + RTK Query**: State management
- **Vite**: Build tool
- **Recharts + D3.js**: Data visualization

---

## 💻 Development

### Project Structure

```
mara-hcp/
├── services/              # Backend microservices
│   ├── api-gateway/      # Kong gateway configuration
│   ├── orchestrator/     # Core orchestration engine (Go)
│   ├── optimizer/        # Economic optimizer (Go + Python)
│   ├── workload-router/  # Workload routing service (Go)
│   ├── resource-manager/ # Resource management (Rust)
│   ├── billing/          # Billing and metering (Go)
│   └── ml-services/      # ML model serving (Python)
├── web/                  # Frontend applications
│   ├── portal/           # Customer web portal (React)
│   └── admin/            # Admin dashboard (React)
├── simulators/           # Hardware and system simulators
│   ├── gpu-sim/          # GPU simulator (Python)
│   ├── asic-sim/         # ASIC simulator (Python)
│   ├── market-sim/       # Market data simulator (Python)
│   └── grid-sim/         # Grid simulator (Python)
├── infrastructure/       # IaC and deployment
│   ├── terraform/        # Terraform modules
│   ├── kubernetes/       # K8s manifests and Helm charts
│   ├── docker/           # Dockerfiles and init scripts
│   └── monitoring/       # Prometheus/Grafana configs
├── scripts/              # Utility scripts
├── docs/                 # Documentation
└── tests/                # Integration and E2E tests
```

### Common Development Commands

```bash
# Start infrastructure
make start

# Stop infrastructure
make stop

# View logs
make logs

# Run tests
make test

# Run linters
make lint

# Database shells
make db-shell          # PostgreSQL
make timescale-shell   # TimescaleDB
make redis-shell       # Redis
make mongo-shell       # MongoDB
make neo4j-shell       # Neo4j

# Health check
make health
```

### Running Services Locally

```bash
# Orchestrator (Go)
make dev-orchestrator

# Optimizer (Python)
make dev-optimizer

# GPU Simulator (Python)
make dev-simulator-gpu

# ASIC Simulator (Python)
make dev-simulator-asic
```

---

## 🧪 Testing

### Unit Tests

```bash
# All tests
make test

# Go tests
make test-go

# Python tests
make test-python

# Frontend tests
make test-frontend
```

### Integration Tests

```bash
cd tests
go test ./integration/... -v
```

### Load Testing

```bash
cd tests
python load_test.py --workloads 10000 --duration 300
```

---

## 🚢 Deployment

### Local Development

```bash
make setup    # One-time setup
make start    # Start services
```

### Production (Kubernetes)

```bash
cd infrastructure/kubernetes

# Apply infrastructure
kubectl apply -f namespace.yml
kubectl apply -f secrets.yml
kubectl apply -f configmaps.yml

# Deploy services
helm install mara-hcp ./helm-chart

# Verify deployment
kubectl get pods -n mara-hcp
```

---

## 📚 Documentation

- **[Development Plan](../development-plan-cursor.md)**: Detailed 30-sprint development roadmap
- **[Design System](../design-system-and-ux.md)**: Complete UX specifications and mockups
- **[API Documentation](docs/api/)**: REST API reference
- **[Architecture Guide](docs/architecture.md)**: Detailed architecture documentation
- **[Deployment Guide](docs/deployment.md)**: Production deployment instructions

---

## 🤝 Contributing

This is an internal MARA Holdings project. For development workflow:

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `make test`
3. Lint code: `make lint`
4. Commit changes: `git commit -m "feat: add my feature"`
5. Push and create PR: `git push origin feature/my-feature`

---

## 📝 License

Copyright © 2025 MARA Holdings. All rights reserved.

---

## 🆘 Support

For issues or questions:
- Internal Slack: #mara-hcp-dev
- Email: dev@mara.com

---

## 🗺️ Roadmap

### Phase 1: Foundation (Sprints 0-5) ✅ Sprint 0 Complete
- [x] Project setup and infrastructure
- [ ] Core services and simulators
- [ ] Economic optimization engine
- [ ] Workload routing
- [ ] Resource management

### Phase 2: Core Platform (Sprints 6-12)
- [ ] Monitoring and observability
- [ ] Customer portal
- [ ] Billing system
- [ ] ML model integration

### Phase 3-7: Advanced Features
- [ ] Security and compliance
- [ ] DevOps automation
- [ ] Performance optimization
- [ ] Production readiness

---

**Built with ❤️ by the MARA Platform Team**

