#!/usr/bin/env python3
"""
MARA HCP - Complete Frontend Screen Test
Tests all pages for both Admin and Customer roles
"""

import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class MARAFrontendTester:
    def __init__(self):
        self.base_url = "http://localhost:3001"
        self.results = []
        self.driver = None
        
    def setup_driver(self):
        """Setup Chrome driver with headless option"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            return True
        except Exception as e:
            print(f"❌ Failed to setup Chrome driver: {e}")
            print("   Please install ChromeDriver: brew install chromedriver")
            return False
    
    def test_result(self, test_name, passed, message=""):
        """Record test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        self.results.append({
            "name": test_name,
            "status": status,
            "passed": passed,
            "message": message
        })
        print(f"{status} - {test_name}")
        if message and not passed:
            print(f"   {message}")
    
    def wait_for_element(self, by, value, timeout=10):
        """Wait for element to be present"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return element
        except TimeoutException:
            return None
    
    def login(self, role="admin"):
        """Login with specified role"""
        print(f"\n🔐 Logging in as {role}...")
        
        # Go to login page
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        # Select role
        if role == "admin":
            email = "admin@mara.com"
            password = "admin123"
        else:
            email = "john@acme.com"
            password = "customer123"
        
        try:
            # Fill in email
            email_input = self.wait_for_element(By.CSS_SELECTOR, 'input[type="email"]')
            if email_input:
                email_input.send_keys(email)
            
            # Fill in password
            password_input = self.wait_for_element(By.CSS_SELECTOR, 'input[type="password"]')
            if password_input:
                password_input.send_keys(password)
            
            # Click login button
            time.sleep(1)
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login') or contains(text(), 'Sign In') or contains(text(), 'Continue')]")
            login_button.click()
            
            # Wait for redirect to dashboard
            time.sleep(3)
            
            # Check if we're on the dashboard
            current_url = self.driver.current_url
            if "/app/dashboard" in current_url or "/dashboard" in current_url:
                self.test_result(f"Login as {role}", True)
                return True
            else:
                self.test_result(f"Login as {role}", False, f"Not redirected to dashboard. URL: {current_url}")
                return False
                
        except Exception as e:
            self.test_result(f"Login as {role}", False, str(e))
            return False
    
    def test_page(self, page_name, url_path, expected_elements=None):
        """Test a single page"""
        print(f"\n   Testing: {page_name}")
        
        try:
            self.driver.get(f"{self.base_url}{url_path}")
            time.sleep(2)
            
            # Check if page loaded (not blank)
            page_source = self.driver.page_source
            
            # Check for common error indicators
            if "Cannot GET" in page_source:
                self.test_result(f"{page_name} - Page Load", False, "404 Not Found")
                return False
            
            # Check if we have the root element
            try:
                root = self.driver.find_element(By.ID, "root")
                if root.text.strip() == "":
                    self.test_result(f"{page_name} - Page Load", False, "Blank page (empty root)")
                    return False
            except NoSuchElementException:
                self.test_result(f"{page_name} - Page Load", False, "No root element")
                return False
            
            # Check for expected elements if provided
            if expected_elements:
                for element_text in expected_elements:
                    if element_text.lower() not in page_source.lower():
                        self.test_result(f"{page_name} - Content", False, f"Missing: {element_text}")
                        return False
            
            self.test_result(f"{page_name} - Page Load", True)
            return True
            
        except Exception as e:
            self.test_result(f"{page_name} - Page Load", False, str(e))
            return False
    
    def test_landing_page(self):
        """Test landing page (no auth required)"""
        print("\n📄 Testing Landing Page...")
        self.driver.get(self.base_url)
        time.sleep(2)
        
        page_source = self.driver.page_source
        
        # Check for key landing page elements
        checks = {
            "MARA": "MARA" in page_source,
            "Get Started Button": "Get Started" in page_source or "Sign In" in page_source,
            "Features Section": "feature" in page_source.lower(),
        }
        
        all_passed = all(checks.values())
        self.test_result("Landing Page", all_passed, 
                        f"Missing: {[k for k,v in checks.items() if not v]}")
    
    def test_admin_screens(self):
        """Test all admin screens"""
        print("\n" + "="*70)
        print("👨‍💼 TESTING ADMIN SCREENS")
        print("="*70)
        
        if not self.login("admin"):
            print("⚠️  Skipping admin tests - login failed")
            return
        
        # Define admin pages to test
        admin_pages = [
            ("Dashboard", "/app/dashboard", ["Dashboard", "KPI", "Utilization"]),
            ("Resources", "/app/resources", ["Resources", "GPU", "ASIC"]),
            ("Workloads", "/app/workloads", ["Workloads", "Status", "Priority"]),
            ("Billing", "/app/billing", ["Billing", "Revenue", "Invoice"]),
            ("Settings", "/app/settings", ["Settings", "Profile", "Account"]),
            ("Alerts", "/app/alerts", ["Alerts", "Notification"]),
        ]
        
        for page_name, url, expected in admin_pages:
            self.test_page(f"Admin - {page_name}", url, expected)
            time.sleep(1)
    
    def test_customer_screens(self):
        """Test all customer screens"""
        print("\n" + "="*70)
        print("👤 TESTING CUSTOMER SCREENS")
        print("="*70)
        
        # Logout first
        try:
            self.driver.get(f"{self.base_url}/")
            time.sleep(2)
        except:
            pass
        
        if not self.login("customer"):
            print("⚠️  Skipping customer tests - login failed")
            return
        
        # Define customer pages to test
        customer_pages = [
            ("Dashboard", "/app/dashboard", ["Dashboard", "Workload", "Budget"]),
            ("Workloads", "/app/workloads", ["Workloads", "My Workloads"]),
            ("Billing", "/app/billing", ["Billing", "Spending", "Budget"]),
            ("Settings", "/app/settings", ["Settings", "Profile"]),
            ("Alerts", "/app/alerts", ["Alerts"]),
            ("Help", "/app/help", ["Help", "Support", "FAQ"]),
        ]
        
        for page_name, url, expected in customer_pages:
            self.test_page(f"Customer - {page_name}", url, expected)
            time.sleep(1)
    
    def generate_report(self):
        """Generate test report"""
        print("\n" + "="*70)
        print("📊 TEST SUMMARY")
        print("="*70)
        
        passed = sum(1 for r in self.results if r["passed"])
        failed = sum(1 for r in self.results if not r["passed"])
        total = len(self.results)
        
        print(f"\nTotal Tests: {total}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for r in self.results:
                if not r["passed"]:
                    print(f"   - {r['name']}")
                    if r['message']:
                        print(f"     {r['message']}")
        
        # Save report to file
        with open("/Users/sdixit/Documents/MARA/FRONTEND-TEST-REPORT.json", "w") as f:
            json.dump({
                "timestamp": time.time(),
                "total": total,
                "passed": passed,
                "failed": failed,
                "success_rate": passed/total*100,
                "results": self.results
            }, f, indent=2)
        
        print("\n📄 Report saved to: FRONTEND-TEST-REPORT.json")
        
        return failed == 0
    
    def run_all_tests(self):
        """Run all tests"""
        print("╔══════════════════════════════════════════════════════════════════════╗")
        print("║         🧪 MARA HCP - COMPLETE FRONTEND SCREEN TEST                 ║")
        print("╚══════════════════════════════════════════════════════════════════════╝")
        
        if not self.setup_driver():
            print("\n⚠️  Cannot run tests without ChromeDriver")
            print("   Install with: brew install chromedriver")
            print("   Or run tests manually in browser:")
            print("   1. Go to http://localhost:3001")
            print("   2. Login as admin@mara.com / admin123")
            print("   3. Test each page manually")
            return False
        
        try:
            # Test landing page
            self.test_landing_page()
            
            # Test admin screens
            self.test_admin_screens()
            
            # Test customer screens
            self.test_customer_screens()
            
            # Generate report
            return self.generate_report()
            
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    tester = MARAFrontendTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)

