# Getting Started with MARA HCP Development

This guide will help you set up your local development environment for the MARA Hybrid Compute Platform.

## Prerequisites

### Required Software

1. **Docker Desktop 4.0+**
   - Download from https://www.docker.com/products/docker-desktop
   - Enable Kubernetes (optional for local dev)
   - Allocate at least 8GB RAM and 4 CPU cores to Docker

2. **Go 1.21+**
   ```bash
   # macOS
   brew install go
   
   # Verify
   go version
   ```

3. **Python 3.12+**
   ```bash
   # macOS
   brew install python@3.12
   
   # Create virtual environment
   python3.12 -m venv venv
   source venv/bin/activate
   ```

4. **Node.js 18+**
   ```bash
   # macOS
   brew install node@18
   
   # Verify
   node --version
   npm --version
   ```

5. **Make**
   ```bash
   # macOS (usually pre-installed)
   xcode-select --install
   ```

### Optional Tools

- **golangci-lint**: For Go linting
  ```bash
  brew install golangci-lint
  ```

- **k9s**: Kubernetes CLI (for production)
  ```bash
  brew install k9s
  ```

- **Postman or Insomnia**: For API testing

---

## 🚀 Initial Setup

### 1. Clone Repository

```bash
cd /Users/sdixit/Documents/MARA
cd mara-hcp
```

### 2. Setup Infrastructure

```bash
# One-command setup
make setup
```

This will:
- Pull all Docker images (may take 5-10 minutes first time)
- Start all infrastructure services
- Initialize databases with schemas
- Wait for services to be healthy
- Run database migrations

### 3. Verify Installation

```bash
# Check all services are running
make health

# Expected output:
# PostgreSQL:   ✓
# TimescaleDB:  ✓
# Redis:        ✓
# Kafka:        ✓
# Prometheus:   ✓
# Grafana:      ✓
# Kong:         ✓
```

### 4. View Logs

```bash
# All services
make logs

# Specific service
make logs-postgres
make logs-kafka
```

---

## 🌐 Access the Services

### Monitoring & Management

1. **Grafana** - Metrics & Dashboards
   - URL: http://localhost:3000
   - Username: `admin`
   - Password: `admin`
   - First login: Change password or skip

2. **Prometheus** - Metrics Database
   - URL: http://localhost:9090
   - Query metrics: `up`, `mara_gpu_utilization_percent`

3. **Kong Admin UI** - API Gateway Management
   - Admin API: http://localhost:8001
   - Proxy: http://localhost:8000
   - Test: `curl http://localhost:8001/status`

4. **Consul UI** - Service Discovery
   - URL: http://localhost:8500
   - View registered services

5. **Vault** - Secrets Management
   - URL: http://localhost:8200
   - Root Token: `dev-token`

6. **Neo4j Browser** - Graph Database
   - URL: http://localhost:7474
   - Username: `neo4j`
   - Password: `dev_password`

### Database Access

```bash
# PostgreSQL (operational data)
make db-shell
# Then: \dt to list tables, \d resources to describe table

# TimescaleDB (metrics)
make timescale-shell
# Then: SELECT * FROM metrics LIMIT 10;

# Redis (cache)
make redis-shell
# Then: KEYS *

# MongoDB (audit logs)
make mongo-shell
# Then: show collections

# Neo4j (relationships)
make neo4j-shell
# Then: MATCH (n) RETURN n LIMIT 10;
```

---

## 💻 Develop Your First Service

### Option 1: Orchestrator Service (Go)

```bash
# 1. Navigate to service directory
cd services/orchestrator

# 2. Initialize Go module
go mod init github.com/mara/hcp/orchestrator
go mod tidy

# 3. Create main.go
# (See services/orchestrator/main.go)

# 4. Run locally
go run main.go

# Service will start on http://localhost:8080
```

### Option 2: GPU Simulator (Python)

```bash
# 1. Navigate to simulator directory
cd simulators/gpu-sim

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run simulator
python main.py

# Simulator will start generating GPU metrics
```

---

## 🧪 Test Your Setup

### 1. Health Check

```bash
make health
```

### 2. Query Metrics

```bash
# Check Prometheus is receiving metrics
curl http://localhost:9090/api/v1/query?query=up
```

### 3. Test Database

```bash
# Query PostgreSQL
docker-compose exec postgres psql -U mara -d mara_hcp -c "SELECT * FROM facilities;"
```

### 4. Test API Gateway

```bash
# Test Kong proxy
curl http://localhost:8000/api/v1/health
```

---

## 🛠️ Common Tasks

### Start/Stop Services

```bash
# Start all
make start

# Stop all
make stop

# Restart all
make restart
```

### View Logs

```bash
# All logs (follow mode)
make logs

# Specific service
docker-compose logs -f postgres
docker-compose logs -f kafka
```

### Clean Up

```bash
# Stop and remove containers (keeps volumes)
docker-compose down

# Remove everything including data (⚠️ destructive)
make clean
```

### Backup Database

```bash
# Create backup
make backup-db

# Restore from backup
make restore-db FILE=backups/mara_hcp_20250101_120000.sql
```

---

## 🐛 Troubleshooting

### Port Conflicts

If ports 3000, 5432, 6379, 8000, 8200, 8500, 9090, or 27017 are already in use:

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

Or edit `docker-compose.yml` to use different ports.

### Services Not Starting

```bash
# Check Docker is running
docker ps

# Check logs for errors
make logs

# Restart specific service
docker-compose restart postgres
```

### Database Connection Errors

```bash
# Verify database is healthy
docker-compose exec postgres pg_isready -U mara

# Check connection string
docker-compose exec postgres psql -U mara -d mara_hcp -c "SELECT 1;"
```

### Kafka Connection Errors

```bash
# Verify Kafka is running
docker-compose exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092

# Check topics
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

---

## 📚 Next Steps

1. **Read the Development Plan**: `development-plan-cursor.md`
2. **Explore the Design System**: `design-system-and-ux.md`
3. **Start Sprint 1**: Build core services and simulators
4. **Join Slack**: #mara-hcp-dev for questions

---

## 🆘 Getting Help

- **Documentation**: `docs/` directory
- **Slack**: #mara-hcp-dev
- **Email**: dev@mara.com
- **Issues**: Create a ticket in JIRA

---

Happy coding! 🚀

