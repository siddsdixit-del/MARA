#!/usr/bin/env python3
"""
Comprehensive Integration Test Suite for MARA HCP
Tests all microservices, simulators, and end-to-end flows
"""

import asyncio
import json
import time
import requests
import websocket
from typing import Dict, List, Any
from dataclasses import dataclass
from enum import Enum

class TestStatus(Enum):
    PASSED = "✅ PASSED"
    FAILED = "❌ FAILED"
    SKIPPED = "⏭️  SKIPPED"
    WARNING = "⚠️  WARNING"

@dataclass
class TestResult:
    name: str
    status: TestStatus
    duration_ms: float
    message: str = ""

class IntegrationTestSuite:
    def __init__(self):
        self.results: List[TestResult] = []
        self.services = {
            "orchestrator": "http://localhost:8080",
            "optimizer": "http://localhost:8081",
            "workload_router": "http://localhost:8082",
            "resource_manager": "http://localhost:8083",
            "billing": "http://localhost:8084",
            "auth": "http://localhost:8085",
            "websocket": "http://localhost:8086",
            "kong": "http://localhost:8000",
            "prometheus": "http://localhost:9090",
            "grafana": "http://localhost:3000",
        }
        self.auth_token = None

    def run_test(self, name: str, test_func):
        """Run a single test and record result"""
        print(f"\n🧪 Running: {name}")
        start = time.time()
        try:
            test_func()
            duration = (time.time() - start) * 1000
            result = TestResult(name, TestStatus.PASSED, duration)
            print(f"   {result.status.value} ({duration:.2f}ms)")
        except Exception as e:
            duration = (time.time() - start) * 1000
            result = TestResult(name, TestStatus.FAILED, duration, str(e))
            print(f"   {result.status.value} - {e}")
        
        self.results.append(result)
        return result.status == TestStatus.PASSED

    # ============= SERVICE HEALTH TESTS =============
    
    def test_all_services_healthy(self):
        """Test all services are responding"""
        for name, url in self.services.items():
            try:
                resp = requests.get(f"{url}/health", timeout=2)
                assert resp.status_code == 200, f"{name} returned {resp.status_code}"
            except requests.exceptions.ConnectionError:
                raise AssertionError(f"{name} is not running at {url}")

    def test_orchestrator_health(self):
        resp = requests.get(f"{self.services['orchestrator']}/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"

    def test_optimizer_health(self):
        resp = requests.get(f"{self.services['optimizer']}/health")
        assert resp.status_code == 200

    def test_workload_router_health(self):
        resp = requests.get(f"{self.services['workload_router']}/health")
        assert resp.status_code == 200

    def test_resource_manager_health(self):
        resp = requests.get(f"{self.services['resource_manager']}/health")
        assert resp.status_code == 200

    # ============= AUTHENTICATION TESTS =============

    def test_auth_login(self):
        """Test user login and JWT token generation"""
        resp = requests.post(
            f"{self.services['auth']}/api/v1/auth/login",
            json={"email": "admin@mara.com", "password": "admin123"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "token" in data
        assert data["user"]["role"] == "admin"
        self.auth_token = data["token"]

    def test_auth_protected_endpoint(self):
        """Test protected endpoint with JWT"""
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        resp = requests.get(
            f"{self.services['auth']}/api/v1/auth/me",
            headers=headers
        )
        assert resp.status_code == 200

    def test_auth_invalid_credentials(self):
        """Test login with invalid credentials"""
        resp = requests.post(
            f"{self.services['auth']}/api/v1/auth/login",
            json={"email": "fake@test.com", "password": "wrong"}
        )
        assert resp.status_code == 401

    # ============= WORKLOAD SUBMISSION TESTS =============

    def test_workload_submission(self):
        """Test complete workload submission flow"""
        workload = {
            "type": "ai_inference_realtime",
            "priority": 1,
            "requirements": {
                "gpu_type": "H100",
                "gpu_count": 1,
                "max_latency_ms": 50
            }
        }
        resp = requests.post(
            f"{self.services['workload_router']}/submit",
            json=workload
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "workload_id" in data
        return data["workload_id"]

    def test_workload_classification(self):
        """Test workload classification"""
        workload = {
            "type": "model_training",
            "requirements": {"gpu_count": 4}
        }
        resp = requests.post(
            f"{self.services['workload_router']}/api/v1/workload/classify",
            json=workload
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["priority"] in [1, 2, 3]

    def test_queue_status(self):
        """Test queue status retrieval"""
        resp = requests.get(f"{self.services['workload_router']}/queue")
        assert resp.status_code == 200
        data = resp.json()
        assert "queues" in data

    # ============= RESOURCE MANAGEMENT TESTS =============

    def test_resource_discovery(self):
        """Test resource discovery scan"""
        resp = requests.post(
            f"{self.services['resource_manager']}/resources/discover"
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "discovered" in data

    def test_resource_listing(self):
        """Test listing all resources"""
        resp = requests.get(f"{self.services['resource_manager']}/resources")
        assert resp.status_code == 200
        data = resp.json()
        assert "resources" in data
        assert len(data["resources"]) > 0

    def test_resource_health_monitoring(self):
        """Test resource health checks"""
        resp = requests.get(
            f"{self.services['resource_manager']}/health/monitor"
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "health_checks" in data

    def test_capacity_planning(self):
        """Test capacity planning endpoint"""
        resp = requests.get(
            f"{self.services['resource_manager']}/api/v1/capacity/summary"
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "total_capacity" in data

    # ============= ECONOMIC OPTIMIZATION TESTS =============

    def test_price_data_retrieval(self):
        """Test retrieving current price data"""
        resp = requests.get(f"{self.services['optimizer']}/prices")
        assert resp.status_code == 200
        data = resp.json()
        assert "btc_price" in data
        assert "electricity_price" in data

    def test_profitability_calculation(self):
        """Test profitability calculation"""
        payload = {
            "resource_type": "GPU",
            "workload_type": "ai_inference_realtime"
        }
        resp = requests.post(
            f"{self.services['optimizer']}/profitability/calculate",
            json=payload
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "expected_revenue" in data
        assert "recommendation" in data

    # ============= BILLING TESTS =============

    def test_usage_tracking(self):
        """Test usage tracking"""
        resp = requests.get(
            f"{self.services['billing']}/api/v1/usage/summary"
        )
        assert resp.status_code == 200

    def test_invoice_generation(self):
        """Test invoice generation"""
        resp = requests.post(
            f"{self.services['billing']}/api/v1/invoices/generate",
            json={"customer_id": "test-customer"}
        )
        assert resp.status_code == 200

    # ============= WEBSOCKET TESTS =============

    def test_websocket_connection(self):
        """Test WebSocket real-time connection"""
        ws_url = "ws://localhost:8086/ws?role=admin"
        ws = websocket.create_connection(ws_url, timeout=5)
        
        # Wait for a message
        message = ws.recv()
        data = json.loads(message)
        assert "type" in data
        assert "timestamp" in data
        
        ws.close()

    # ============= END-TO-END WORKFLOW TESTS =============

    def test_complete_workload_lifecycle(self):
        """Test complete workload submission to execution"""
        # 1. Submit workload
        workload = {
            "type": "ai_inference_realtime",
            "priority": 1,
            "requirements": {"gpu_type": "H100", "gpu_count": 1}
        }
        resp = requests.post(
            f"{self.services['workload_router']}/submit",
            json=workload
        )
        assert resp.status_code == 200
        workload_id = resp.json()["workload_id"]
        
        # 2. Check it's in queue
        resp = requests.get(f"{self.services['workload_router']}/queue")
        assert resp.status_code == 200
        
        # 3. Verify resources available
        resp = requests.get(f"{self.services['resource_manager']}/resources")
        assert resp.status_code == 200
        assert len(resp.json()["resources"]) > 0

    def test_fast_workload_switching(self):
        """Test fast switching between workloads (<500ms)"""
        start = time.time()
        
        # Submit mining workload
        resp1 = requests.post(
            f"{self.services['workload_router']}/submit",
            json={"type": "bitcoin_mining", "priority": 3}
        )
        assert resp1.status_code == 200
        
        # Submit AI workload (higher priority)
        resp2 = requests.post(
            f"{self.services['workload_router']}/submit",
            json={"type": "ai_inference_realtime", "priority": 1}
        )
        assert resp2.status_code == 200
        
        duration_ms = (time.time() - start) * 1000
        assert duration_ms < 500, f"Switching took {duration_ms:.2f}ms"

    def test_kong_api_gateway(self):
        """Test Kong API Gateway routing"""
        try:
            resp = requests.get(
                f"{self.services['kong']}/api/v1/orchestrator/health"
            )
            assert resp.status_code == 200
        except:
            # Kong might not be running, not critical for simulator
            raise AssertionError("Kong not available (optional)")

    # ============= PERFORMANCE TESTS =============

    def test_api_response_times(self):
        """Test API response times are under 100ms"""
        endpoints = [
            (self.services['orchestrator'], "/health"),
            (self.services['optimizer'], "/prices"),
            (self.services['resource_manager'], "/resources"),
        ]
        
        for base_url, path in endpoints:
            start = time.time()
            resp = requests.get(f"{base_url}{path}")
            duration_ms = (time.time() - start) * 1000
            assert resp.status_code == 200
            assert duration_ms < 100, f"{path} took {duration_ms:.2f}ms"

    def test_concurrent_workload_submissions(self):
        """Test handling concurrent workload submissions"""
        import concurrent.futures
        
        def submit_workload(i):
            resp = requests.post(
                f"{self.services['workload_router']}/submit",
                json={"type": "ai_inference_batch", "priority": 2}
            )
            return resp.status_code == 200
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(submit_workload, i) for i in range(10)]
            results = [f.result() for f in futures]
        
        assert all(results), "Some concurrent submissions failed"

    # ============= RUN ALL TESTS =============

    def run_all(self):
        """Run all tests and generate report"""
        print("=" * 70)
        print("🧪 MARA HCP - COMPREHENSIVE INTEGRATION TEST SUITE")
        print("=" * 70)

        # Service Health Tests
        print("\n" + "=" * 70)
        print("📡 SERVICE HEALTH TESTS")
        print("=" * 70)
        self.run_test("Orchestrator Health", self.test_orchestrator_health)
        self.run_test("Optimizer Health", self.test_optimizer_health)
        self.run_test("Workload Router Health", self.test_workload_router_health)
        self.run_test("Resource Manager Health", self.test_resource_manager_health)

        # Authentication Tests
        print("\n" + "=" * 70)
        print("🔐 AUTHENTICATION & AUTHORIZATION TESTS")
        print("=" * 70)
        self.run_test("User Login", self.test_auth_login)
        self.run_test("Protected Endpoint Access", self.test_auth_protected_endpoint)
        self.run_test("Invalid Credentials", self.test_auth_invalid_credentials)

        # Workload Tests
        print("\n" + "=" * 70)
        print("📦 WORKLOAD MANAGEMENT TESTS")
        print("=" * 70)
        self.run_test("Workload Submission", self.test_workload_submission)
        self.run_test("Workload Classification", self.test_workload_classification)
        self.run_test("Queue Status", self.test_queue_status)

        # Resource Tests
        print("\n" + "=" * 70)
        print("💻 RESOURCE MANAGEMENT TESTS")
        print("=" * 70)
        self.run_test("Resource Discovery", self.test_resource_discovery)
        self.run_test("Resource Listing", self.test_resource_listing)
        self.run_test("Health Monitoring", self.test_resource_health_monitoring)
        self.run_test("Capacity Planning", self.test_capacity_planning)

        # Economic Tests
        print("\n" + "=" * 70)
        print("💰 ECONOMIC OPTIMIZATION TESTS")
        print("=" * 70)
        self.run_test("Price Data Retrieval", self.test_price_data_retrieval)
        self.run_test("Profitability Calculation", self.test_profitability_calculation)

        # Billing Tests
        print("\n" + "=" * 70)
        print("💳 BILLING TESTS")
        print("=" * 70)
        self.run_test("Usage Tracking", self.test_usage_tracking)
        self.run_test("Invoice Generation", self.test_invoice_generation)

        # WebSocket Tests
        print("\n" + "=" * 70)
        print("🔌 REAL-TIME WEBSOCKET TESTS")
        print("=" * 70)
        self.run_test("WebSocket Connection", self.test_websocket_connection)

        # End-to-End Tests
        print("\n" + "=" * 70)
        print("🔄 END-TO-END WORKFLOW TESTS")
        print("=" * 70)
        self.run_test("Complete Workload Lifecycle", self.test_complete_workload_lifecycle)
        self.run_test("Fast Workload Switching (<500ms)", self.test_fast_workload_switching)

        # Performance Tests
        print("\n" + "=" * 70)
        print("⚡ PERFORMANCE TESTS")
        print("=" * 70)
        self.run_test("API Response Times (<100ms)", self.test_api_response_times)
        self.run_test("Concurrent Submissions", self.test_concurrent_workload_submissions)

        # Optional Tests
        print("\n" + "=" * 70)
        print("🔧 OPTIONAL COMPONENT TESTS")
        print("=" * 70)
        self.run_test("Kong API Gateway", self.test_kong_api_gateway)

        # Generate Report
        self.generate_report()

    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)

        passed = sum(1 for r in self.results if r.status == TestStatus.PASSED)
        failed = sum(1 for r in self.results if r.status == TestStatus.FAILED)
        total = len(self.results)

        print(f"\nTotal Tests: {total}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")

        avg_duration = sum(r.duration_ms for r in self.results) / total
        print(f"\nAverage Test Duration: {avg_duration:.2f}ms")

        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for r in self.results:
                if r.status == TestStatus.FAILED:
                    print(f"   - {r.name}: {r.message}")

        print("\n" + "=" * 70)
        
        # Save to file
        with open("/Users/sdixit/Documents/MARA/TEST-REPORT.json", "w") as f:
            json.dump({
                "timestamp": time.time(),
                "summary": {
                    "total": total,
                    "passed": passed,
                    "failed": failed,
                    "success_rate": (passed/total)*100
                },
                "results": [
                    {
                        "name": r.name,
                        "status": r.status.value,
                        "duration_ms": r.duration_ms,
                        "message": r.message
                    }
                    for r in self.results
                ]
            }, f, indent=2)

if __name__ == "__main__":
    suite = IntegrationTestSuite()
    suite.run_all()

