#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════╗
# ║         MARA HCP - COMPLETE FRONTEND & AUTH TEST SUITE              ║
# ╚══════════════════════════════════════════════════════════════════════╝

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║         🧪 MARA HCP - FRONTEND & AUTH TEST SUITE                    ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

FAILED_TESTS=0
PASSED_TESTS=0

# Helper function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_code="${3:-200}"
    
    echo "Testing: $name"
    echo "  URL: $url"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>&1)
    
    if [ "$response" = "$expected_code" ]; then
        echo "  ✅ PASS (HTTP $response)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  ❌ FAIL (Expected $expected_code, got $response)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

# Test JSON endpoint
test_json_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    
    echo "Testing: $name"
    echo "  URL: $url"
    echo "  Method: $method"
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    else
        response=$(curl -s "$url" 2>&1)
    fi
    
    if echo "$response" | grep -q '"' || echo "$response" | grep -q '{'; then
        echo "  ✅ PASS - Valid JSON response"
        echo "  Response preview: ${response:0:100}..."
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  ❌ FAIL - No JSON in response"
        echo "  Response: $response"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PART 1: BACKEND SERVICE HEALTH CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_json_endpoint "Orchestrator Health" "http://localhost:8080/health"
test_json_endpoint "Optimizer Health" "http://localhost:8081/health"
test_json_endpoint "Workload Router Health" "http://localhost:8082/health"
test_json_endpoint "Resource Manager Health" "http://localhost:8083/health"
test_json_endpoint "Billing Health" "http://localhost:8084/health"
test_json_endpoint "Auth Health" "http://localhost:8085/health"
test_json_endpoint "WebSocket Health" "http://localhost:8086/health"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PART 2: FRONTEND ACCESSIBILITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Frontend Landing Page" "http://localhost:3001"
test_endpoint "Frontend App (should redirect)" "http://localhost:3001/app"
test_endpoint "Frontend Login Page" "http://localhost:3001/login"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PART 3: AUTHENTICATION API TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test admin login
echo "Testing: Admin Login"
ADMIN_LOGIN=$(curl -s -X POST http://localhost:8085/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@mara.com","password":"admin123"}')

if echo "$ADMIN_LOGIN" | grep -q '"token"'; then
    echo "  ✅ PASS - Admin login successful"
    ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "  Token received: ${ADMIN_TOKEN:0:30}..."
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo "  ❌ FAIL - Admin login failed"
    echo "  Response: $ADMIN_LOGIN"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# Test customer login
echo "Testing: Customer Login"
CUSTOMER_LOGIN=$(curl -s -X POST http://localhost:8085/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"john@acme.com","password":"customer123"}')

if echo "$CUSTOMER_LOGIN" | grep -q '"token"'; then
    echo "  ✅ PASS - Customer login successful"
    CUSTOMER_TOKEN=$(echo "$CUSTOMER_LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "  Token received: ${CUSTOMER_TOKEN:0:30}..."
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo "  ❌ FAIL - Customer login failed"
    echo "  Response: $CUSTOMER_LOGIN"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# Test protected endpoint with token
if [ -n "$ADMIN_TOKEN" ]; then
    echo "Testing: Protected Endpoint (Get Current User)"
    CURRENT_USER=$(curl -s http://localhost:8085/api/v1/auth/me \
        -H "Authorization: Bearer $ADMIN_TOKEN")
    
    if echo "$CURRENT_USER" | grep -q '"user"'; then
        echo "  ✅ PASS - Protected endpoint accessible with token"
        echo "  User: $(echo "$CURRENT_USER" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  ❌ FAIL - Protected endpoint not accessible"
        echo "  Response: $CURRENT_USER"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
fi

# Test invalid credentials
echo "Testing: Invalid Credentials (Security Check)"
INVALID_LOGIN=$(curl -s -X POST http://localhost:8085/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"fake@test.com","password":"wrongpassword"}')

if echo "$INVALID_LOGIN" | grep -q '"error"'; then
    echo "  ✅ PASS - Invalid credentials properly rejected"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo "  ❌ FAIL - Security issue: invalid credentials accepted"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PART 4: FRONTEND STATIC ASSETS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Vite dev server is serving files
echo "Testing: Vite Dev Server"
VITE_RESPONSE=$(curl -s http://localhost:3001 2>&1)

if echo "$VITE_RESPONSE" | grep -q 'vite' || echo "$VITE_RESPONSE" | grep -q 'div id="root"'; then
    echo "  ✅ PASS - Vite dev server is running"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo "  ❌ FAIL - Vite dev server issue"
    echo "  Response preview: ${VITE_RESPONSE:0:200}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PART 5: CHECK RUNNING PROCESSES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Checking process status..."
echo ""

# Check if frontend is running
if lsof -ti :3001 > /dev/null 2>&1; then
    echo "  ✅ Frontend process is running on port 3001"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo "  ❌ Frontend process NOT running on port 3001"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# Check backend services
for port in 8080 8081 8082 8083 8084 8085 8086; do
    if lsof -ti :$port > /dev/null 2>&1; then
        echo "  ✅ Service running on port $port"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  ❌ No service on port $port"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
done
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PART 6: CHECK LOGS FOR ERRORS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Checking frontend logs for errors..."
if [ -f /tmp/mara-frontend.log ]; then
    ERROR_COUNT=$(grep -i "error\|fail\|fatal" /tmp/mara-frontend.log | wc -l | tr -d ' ')
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo "  ⚠️  Found $ERROR_COUNT errors in frontend log"
        echo "  Recent errors:"
        grep -i "error\|fail\|fatal" /tmp/mara-frontend.log | tail -5
    else
        echo "  ✅ No errors in frontend log"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
else
    echo "  ⚠️  Frontend log not found at /tmp/mara-frontend.log"
fi
echo ""

echo "Checking auth service logs for errors..."
if [ -f /tmp/mara-auth.log ]; then
    AUTH_ERROR_COUNT=$(grep -i "error\|fail\|fatal" /tmp/mara-auth.log | grep -v "level=info" | wc -l | tr -d ' ')
    if [ "$AUTH_ERROR_COUNT" -gt 0 ]; then
        echo "  ⚠️  Found $AUTH_ERROR_COUNT errors in auth log"
        echo "  Recent errors:"
        grep -i "error\|fail\|fatal" /tmp/mara-auth.log | grep -v "level=info" | tail -5
    else
        echo "  ✅ No errors in auth log"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
else
    echo "  ⚠️  Auth log not found at /tmp/mara-auth.log"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL_TESTS=$((PASSED_TESTS + FAILED_TESTS))
SUCCESS_RATE=0
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
fi

echo "Total Tests:    $TOTAL_TESTS"
echo "✅ Passed:      $PASSED_TESTS"
echo "❌ Failed:      $FAILED_TESTS"
echo "Success Rate:   $SUCCESS_RATE%"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║               🎉 ALL TESTS PASSED! 🎉                               ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    exit 0
else
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║               ⚠️  SOME TESTS FAILED                                 ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🔧 Recommendations:"
    echo ""
    
    # Check if frontend is not running
    if ! lsof -ti :3001 > /dev/null 2>&1; then
        echo "  1. Start Frontend:"
        echo "     cd /Users/sdixit/Documents/MARA/frontend-prototype"
        echo "     npm run dev"
        echo ""
    fi
    
    # Check if auth service is not running
    if ! lsof -ti :8085 > /dev/null 2>&1; then
        echo "  2. Start Auth Service:"
        echo "     cd /Users/sdixit/Documents/MARA/mara-hcp/services/auth"
        echo "     go run main.go"
        echo ""
    fi
    
    echo "  3. Check logs:"
    echo "     tail -f /tmp/mara-*.log"
    echo ""
    
    echo "  4. Or use the complete startup script:"
    echo "     cd /Users/sdixit/Documents/MARA/mara-hcp"
    echo "     ./scripts/startup-complete.sh"
    echo ""
    
    exit 1
fi

