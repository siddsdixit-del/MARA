#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════╗
# ║                 MARA HCP - STOP ALL SERVICES                         ║
# ╚══════════════════════════════════════════════════════════════════════╝

echo "🛑 Stopping MARA HCP services..."
echo ""

# Kill all background processes
echo "Stopping backend services..."
for pidfile in /tmp/mara-*.pid; do
    if [ -f "$pidfile" ]; then
        pid=$(cat "$pidfile")
        if ps -p $pid > /dev/null 2>&1; then
            kill $pid 2>/dev/null || true
            echo "   Stopped $(basename $pidfile .pid)"
        fi
        rm "$pidfile"
    fi
done

# Stop Docker services
echo ""
echo "Stopping Docker services..."
cd "$(dirname "$0")/../" || exit
docker-compose down

echo ""
echo "✅ All services stopped"
echo ""
echo "Logs remain in /tmp/mara-*.log for debugging"

