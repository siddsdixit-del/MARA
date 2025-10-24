#!/bin/bash
# Test all MARA HCP services

set -e

echo "🧪 MARA HCP System Test Suite"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url" || echo "FAILED")
    
    if [[ "$response" == *"$expected"* ]]; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "   Expected: $expected"
        echo "   Got: $response"
        return 1
    fi
}

passed=0
failed=0

echo "1️⃣  Testing Infrastructure Services"
echo "-----------------------------------"

# Orchestrator
if test_endpoint "Orchestrator Health" "http://localhost:8080/health" "healthy"; then
    ((passed++))
else
    ((failed++))
fi

# Optimizer
if test_endpoint "Optimizer Health" "http://localhost:8081/health" "healthy"; then
    ((passed++))
else
    ((failed++))
fi

# Workload Router
if test_endpoint "Router Health" "http://localhost:8082/health" "healthy"; then
    ((passed++))
else
    ((failed++))
fi

# Prometheus
if test_endpoint "Prometheus" "http://localhost:9090/-/healthy" "Prometheus"; then
    ((passed++))
else
    ((failed++))
fi

# Grafana
if test_endpoint "Grafana" "http://localhost:3000/api/health" "ok"; then
    ((passed++))
else
    ((failed++))
fi

echo ""
echo "2️⃣  Testing API Endpoints"
echo "------------------------"

# Submit workload
echo -n "Testing Workload Submission... "
response=$(curl -s -X POST http://localhost:8080/api/v1/workloads \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "test-001",
    "workload_type": "ai_inference_realtime",
    "priority": 1,
    "requirements": {"gpu_type": "H100", "gpu_count": 1}
  }')

if [[ "$response" == *"workload_id"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((passed++))
    WORKLOAD_ID=$(echo $response | grep -o '"workload_id":"[^"]*"' | cut -d'"' -f4)
    echo "   Workload ID: $WORKLOAD_ID"
else
    echo -e "${RED}✗ FAIL${NC}"
    ((failed++))
fi

# Get current prices
echo -n "Testing Price Retrieval... "
response=$(curl -s "http://localhost:8081/api/v1/prices/current")
if [[ "$response" == *"prices"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((passed++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((failed++))
fi

# Calculate profitability
echo -n "Testing Profitability Calculation... "
response=$(curl -s -X POST http://localhost:8081/api/v1/profitability/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "resource_type": "GPU",
    "workload_type": "ai_inference_realtime",
    "power_draw_w": 700
  }')

if [[ "$response" == *"score"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((passed++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((failed++))
fi

# Queue depth
echo -n "Testing Queue Depth... "
response=$(curl -s "http://localhost:8082/api/v1/queue/depth")
if [[ "$response" == *"total_depth"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((passed++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((failed++))
fi

echo ""
echo "3️⃣  Testing Metrics"
echo "------------------"

# Orchestrator metrics
echo -n "Testing Orchestrator Metrics... "
response=$(curl -s "http://localhost:8080/metrics")
if [[ "$response" == *"orchestrator_allocations_total"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((passed++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((failed++))
fi

# Optimizer metrics
echo -n "Testing Optimizer Metrics... "
response=$(curl -s "http://localhost:8081/metrics")
if [[ "$response" == *"optimizer_profitability_calculations"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((passed++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((failed++))
fi

echo ""
echo "=============================="
echo "📊 Test Results"
echo "=============================="
echo -e "Passed: ${GREEN}$passed${NC}"
echo -e "Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  SOME TESTS FAILED${NC}"
    exit 1
fi

