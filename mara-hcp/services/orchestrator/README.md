# Orchestrator Service

The core orchestration engine for MARA HCP. Handles workload lifecycle management, resource allocation, and coordination between services.

## Features

- Workload submission and management
- Resource allocation and release
- Priority queue integration
- Prometheus metrics export
- Health checks and readiness probes

## API Endpoints

### Health & Metrics
- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /metrics` - Prometheus metrics

### Workload Management
- `POST /api/v1/workloads` - Submit workload
- `GET /api/v1/workloads/:id` - Get workload details
- `GET /api/v1/workloads` - List workloads

### Resource Allocation
- `POST /api/v1/allocate` - Allocate resources
- `POST /api/v1/release` - Release resources
- `GET /api/v1/status` - Get service status

## Running Locally

```bash
# Install dependencies
go mod download

# Run service
go run main.go

# Or with environment variables
PORT=8080 go run main.go
```

## Running with Docker

```bash
# Build
docker build -t mara-hcp/orchestrator:latest .

# Run
docker run -p 8080:8080 mara-hcp/orchestrator:latest
```

## Testing

```bash
# Health check
curl http://localhost:8080/health

# Submit workload
curl -X POST http://localhost:8080/api/v1/workloads \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust-001",
    "workload_type": "ai_inference_realtime",
    "priority": 1,
    "requirements": {
      "gpu_type": "H100",
      "gpu_count": 1
    }
  }'

# Get metrics
curl http://localhost:8080/metrics
```

## Environment Variables

- `PORT` - HTTP server port (default: 8080)
- `LOG_LEVEL` - Logging level (default: info)

