#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════╗
# ║                   MARA HCP - COMPLETE SYSTEM STARTUP                 ║
# ║          Start all services, simulators, and frontend in order      ║
# ╚══════════════════════════════════════════════════════════════════════╝

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║            🚀 MARA HCP - COMPLETE SYSTEM STARTUP                    ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install: brew install go"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    exit 1
fi

echo "✅ All prerequisites met"
echo ""

# Kill any existing processes on required ports
echo "🧹 Cleaning up existing processes..."
for port in 8080 8081 8082 8083 8084 8085 8086 8090 3001; do
    if lsof -ti :$port > /dev/null 2>&1; then
        echo "   Killing process on port $port..."
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
    fi
done
echo "✅ Cleanup complete"
echo ""

# Start Docker infrastructure
echo "🐳 Starting Docker infrastructure..."
cd "$PROJECT_ROOT/mara-hcp"

if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

docker-compose up -d
echo "⏳ Waiting for services to be healthy (30 seconds)..."
sleep 30
echo "✅ Docker infrastructure ready"
echo ""

# Install Go dependencies and start Go services
echo "🔷 Starting Go services..."
GO_SERVICES=("orchestrator" "optimizer" "workload-router" "resource-manager" "billing" "auth" "websocket")

for service in "${GO_SERVICES[@]}"; do
    SERVICE_DIR="$PROJECT_ROOT/mara-hcp/services/$service"
    if [ -d "$SERVICE_DIR" ]; then
        echo "   Starting $service..."
        cd "$SERVICE_DIR"
        
        # Install dependencies
        go mod download > /dev/null 2>&1 || true
        go mod tidy > /dev/null 2>&1 || true
        
        # Start service in background
        nohup go run main.go > "/tmp/mara-$service.log" 2>&1 &
        echo $! > "/tmp/mara-$service.pid"
        sleep 2
    fi
done
echo "✅ Go services started"
echo ""

# Start Python simulators
echo "🐍 Starting Python simulators..."
SIMULATORS=("gpu-sim" "asic-sim" "market-sim")

for sim in "${SIMULATORS[@]}"; do
    SIM_DIR="$PROJECT_ROOT/mara-hcp/simulators/$sim"
    if [ -d "$SIM_DIR" ]; then
        echo "   Starting $sim..."
        cd "$SIM_DIR"
        nohup python3 main.py > "/tmp/mara-$sim.log" 2>&1 &
        echo $! > "/tmp/mara-$sim.pid"
        sleep 1
    fi
done

# Start Enhanced Simulator
ENHANCED_SIM_DIR="$PROJECT_ROOT/mara-hcp/simulators/enhanced-simulator"
if [ -d "$ENHANCED_SIM_DIR" ]; then
    echo "   Starting enhanced-simulator..."
    cd "$ENHANCED_SIM_DIR"
    pip3 install aiohttp > /dev/null 2>&1 || true
    nohup python3 main.py > "/tmp/mara-enhanced-sim.log" 2>&1 &
    echo $! > "/tmp/mara-enhanced-sim.pid"
    sleep 2
fi

echo "✅ Simulators started"
echo ""

# Start Python services
echo "🐍 Starting Python services..."
PYTHON_SERVICES=("metrics-consumer" "notification")

for service in "${PYTHON_SERVICES[@]}"; do
    SERVICE_DIR="$PROJECT_ROOT/mara-hcp/services/$service"
    if [ -d "$SERVICE_DIR" ]; then
        echo "   Starting $service..."
        cd "$SERVICE_DIR"
        pip3 install -r requirements.txt > /dev/null 2>&1 || true
        nohup python3 main.py > "/tmp/mara-$service.log" 2>&1 &
        echo $! > "/tmp/mara-$service.pid"
        sleep 1
    fi
done
echo "✅ Python services started"
echo ""

# Start metrics exporters
echo "📊 Starting metrics exporters..."
EXPORTER_DIR="$PROJECT_ROOT/mara-hcp/monitoring/exporters"
if [ -d "$EXPORTER_DIR" ]; then
    cd "$EXPORTER_DIR"
    pip3 install -r requirements.txt > /dev/null 2>&1 || true
    
    nohup python3 gpu-exporter.py > "/tmp/mara-gpu-exporter.log" 2>&1 &
    echo $! > "/tmp/mara-gpu-exporter.pid"
    
    nohup python3 asic-exporter.py > "/tmp/mara-asic-exporter.log" 2>&1 &
    echo $! > "/tmp/mara-asic-exporter.pid"
    
    sleep 2
fi
echo "✅ Exporters started"
echo ""

# Start Frontend
echo "⚛️  Starting React frontend..."
FRONTEND_DIR="$PROJECT_ROOT/frontend-prototype"
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo "   Installing npm dependencies..."
    npm install > /dev/null 2>&1
fi

nohup npm run dev > "/tmp/mara-frontend.log" 2>&1 &
echo $! > "/tmp/mara-frontend.pid"
echo "✅ Frontend started"
echo ""

# Wait for all services to be ready
echo "⏳ Waiting for all services to start (15 seconds)..."
sleep 15
echo ""

# Health check
echo "🏥 Running health checks..."
HEALTH_ENDPOINTS=(
    "http://localhost:8080/health|Orchestrator"
    "http://localhost:8081/health|Optimizer"
    "http://localhost:8082/health|Workload Router"
    "http://localhost:8083/health|Resource Manager"
    "http://localhost:8084/health|Billing"
    "http://localhost:8085/health|Auth"
    "http://localhost:8086/health|WebSocket"
    "http://localhost:3000/api/health|Grafana"
    "http://localhost:9090/-/healthy|Prometheus"
)

HEALTHY=0
TOTAL=0

for endpoint_info in "${HEALTH_ENDPOINTS[@]}"; do
    IFS='|' read -r url name <<< "$endpoint_info"
    TOTAL=$((TOTAL + 1))
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo "   ✅ $name"
        HEALTHY=$((HEALTHY + 1))
    else
        echo "   ❌ $name"
    fi
done

echo ""
echo "Health: $HEALTHY/$TOTAL services healthy"
echo ""

# Display access information
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ SYSTEM READY - ACCESS POINTS                    ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 FRONTEND (Main Application):"
echo "   → http://localhost:3001"
echo ""
echo "📊 MONITORING & DASHBOARDS:"
echo "   Grafana:    http://localhost:3000  (admin/admin)"
echo "   Prometheus: http://localhost:9090"
echo "   Kong Admin: http://localhost:8001"
echo "   Consul UI:  http://localhost:8500"
echo "   Neo4j:      http://localhost:7474  (neo4j/dev_password)"
echo ""
echo "🔌 BACKEND APIs:"
echo "   Orchestrator:      http://localhost:8080"
echo "   Optimizer:         http://localhost:8081"
echo "   Workload Router:   http://localhost:8082"
echo "   Resource Manager:  http://localhost:8083"
echo "   Billing:           http://localhost:8084"
echo "   Auth:              http://localhost:8085"
echo "   WebSocket:         ws://localhost:8086/ws"
echo "   API Gateway (Kong): http://localhost:8000"
echo ""
echo "🔬 SIMULATORS:"
echo "   Enhanced Simulator: http://localhost:8090"
echo ""
echo "👤 DEFAULT CREDENTIALS:"
echo "   Admin:    admin@mara.com / admin123"
echo "   Customer: john@acme.com / customer123"
echo ""
echo "📝 LOGS:"
echo "   All logs are in: /tmp/mara-*.log"
echo "   Frontend: /tmp/mara-frontend.log"
echo "   Backend:  /tmp/mara-<service>.log"
echo ""
echo "🛑 TO STOP ALL SERVICES:"
echo "   Run: ./scripts/stop-all-services.sh"
echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                    🎉 MARA HCP IS NOW RUNNING!                       ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"

