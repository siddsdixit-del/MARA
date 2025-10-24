#!/bin/bash
# Quick start script for MARA HCP

echo "🚀 MARA HCP Quick Start"
echo "======================="
echo ""

cd /Users/sdixit/Documents/MARA/mara-hcp

echo "1️⃣  Starting infrastructure (Docker Compose)..."
make start

echo ""
echo "2️⃣  Waiting for services to be ready (30 seconds)..."
sleep 30

echo ""
echo "3️⃣  Checking service health..."
make health

echo ""
echo "4️⃣  Infrastructure is ready!"
echo ""
echo "📍 Access Points:"
echo "   Grafana:    http://localhost:3000  (admin/admin)"
echo "   Prometheus: http://localhost:9090"
echo "   Kong Admin: http://localhost:8001"
echo "   Frontend:   http://localhost:3001  (already running!)"
echo ""
echo "5️⃣  To start application services, run:"
echo "   ./scripts/start-all-services.sh"
echo ""
echo "6️⃣  To test the system, run:"
echo "   ./scripts/test-system.sh"
echo ""

