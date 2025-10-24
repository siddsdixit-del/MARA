#!/bin/bash
# Start all MARA HCP services in separate terminal windows

set -e

echo "🚀 Starting MARA HCP Services..."
echo ""

PROJECT_ROOT="/Users/sdixit/Documents/MARA/mara-hcp"

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - Use Terminal app
    
    echo "📦 Starting Orchestrator Service (port 8080)..."
    osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/services/orchestrator && echo '🎯 Orchestrator Service' && go run main.go\""
    sleep 1
    
    echo "💰 Starting Optimizer Service (port 8081)..."
    osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/services/optimizer && echo '💰 Optimizer Service' && go run main.go\""
    sleep 1
    
    echo "🔀 Starting Workload Router (port 8082)..."
    osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/services/workload-router && echo '🔀 Workload Router' && go run main.go\""
    sleep 1
    
    echo "🎮 Starting GPU Simulator (10 GPUs)..."
    osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/simulators/gpu-sim && echo '🎮 GPU Simulator' && python3 main.py\""
    sleep 1
    
    echo "⛏️  Starting ASIC Simulator (50 ASICs)..."
    osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/simulators/asic-sim && echo '⛏️  ASIC Simulator' && python3 main.py\""
    sleep 1
    
    echo "📊 Starting Market Data Simulator..."
    osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/simulators/market-sim && echo '📊 Market Data Simulator' && python3 main.py\""
    sleep 1
    
    echo "📥 Starting Metrics Consumer..."
    osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/services/metrics-consumer && echo '📥 Metrics Consumer' && python3 main.py\""
    
else
    # Linux - use gnome-terminal or xterm
    echo "Linux detected - using gnome-terminal..."
    
    gnome-terminal -- bash -c "cd $PROJECT_ROOT/services/orchestrator && echo '🎯 Orchestrator' && go run main.go; exec bash" &
    gnome-terminal -- bash -c "cd $PROJECT_ROOT/services/optimizer && echo '💰 Optimizer' && go run main.go; exec bash" &
    gnome-terminal -- bash -c "cd $PROJECT_ROOT/services/workload-router && echo '🔀 Router' && go run main.go; exec bash" &
    gnome-terminal -- bash -c "cd $PROJECT_ROOT/simulators/gpu-sim && echo '🎮 GPU Sim' && python3 main.py; exec bash" &
    gnome-terminal -- bash -c "cd $PROJECT_ROOT/simulators/asic-sim && echo '⛏️  ASIC Sim' && python3 main.py; exec bash" &
    gnome-terminal -- bash -c "cd $PROJECT_ROOT/simulators/market-sim && echo '📊 Market Sim' && python3 main.py; exec bash" &
    gnome-terminal -- bash -c "cd $PROJECT_ROOT/services/metrics-consumer && echo '📥 Consumer' && python3 main.py; exec bash" &
fi

echo ""
echo "✅ All services starting in separate terminal windows!"
echo ""
echo "📍 Access Points:"
echo "   Orchestrator:  http://localhost:8080/health"
echo "   Optimizer:     http://localhost:8081/health"
echo "   Router:        http://localhost:8082/health"
echo "   Grafana:       http://localhost:3000"
echo "   Prometheus:    http://localhost:9090"
echo "   Frontend:      http://localhost:3001"
echo ""
echo "⏱️  Wait 10-15 seconds for all services to start..."
echo ""

