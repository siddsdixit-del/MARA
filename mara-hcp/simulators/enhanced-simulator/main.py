#!/usr/bin/env python3
"""
Enhanced Workload Execution Simulator
Simulates fast workload switching with realistic latency
"""

import asyncio
import time
import json
import random
from datetime import datetime
from enum import Enum
from typing import Dict, Optional
from dataclasses import dataclass, asdict

class WorkloadType(Enum):
    AI_INFERENCE_REALTIME = "ai_inference_realtime"
    AI_INFERENCE_BATCH = "ai_inference_batch"
    MODEL_TRAINING = "model_training"
    BITCOIN_MINING = "bitcoin_mining"

class ResourceState(Enum):
    IDLE = "idle"
    SWITCHING = "switching"
    RUNNING = "running"
    COOLDOWN = "cooldown"

@dataclass
class Workload:
    id: str
    type: WorkloadType
    priority: int
    gpu_count: int
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    metrics: Dict = None

@dataclass
class SwitchingMetrics:
    from_workload: str
    to_workload: str
    switch_time_ms: float
    timestamp: float
    success: bool
    gpu_id: str

class GPUSimulator:
    """Simulates a single GPU with fast switching capabilities"""
    
    def __init__(self, gpu_id: str, gpu_type: str = "H100"):
        self.gpu_id = gpu_id
        self.gpu_type = gpu_type
        self.state = ResourceState.IDLE
        self.current_workload: Optional[Workload] = None
        self.switching_metrics: list[SwitchingMetrics] = []
        
        # Switching latencies (milliseconds)
        self.switch_latencies = {
            # (from, to): latency_ms
            ("bitcoin_mining", "ai_inference_realtime"): random.uniform(350, 450),
            ("ai_inference_realtime", "bitcoin_mining"): random.uniform(380, 420),
            ("bitcoin_mining", "ai_inference_batch"): random.uniform(400, 480),
            ("ai_inference_batch", "bitcoin_mining"): random.uniform(390, 460),
            ("idle", "ai_inference_realtime"): random.uniform(150, 250),
            ("idle", "bitcoin_mining"): random.uniform(200, 300),
        }

    async def switch_workload(self, new_workload: Workload) -> SwitchingMetrics:
        """Switch from current workload to new workload with realistic latency"""
        switch_start = time.time()
        
        from_type = self.current_workload.type.value if self.current_workload else "idle"
        to_type = new_workload.type.value
        
        print(f"[{self.gpu_id}] Switching: {from_type} -> {to_type}")
        
        # Get switching latency
        latency_key = (from_type, to_type)
        if latency_key in self.switch_latencies:
            latency_ms = self.switch_latencies[latency_key]
        else:
            latency_ms = random.uniform(300, 500)  # Default latency
        
        # Simulate state changes
        self.state = ResourceState.SWITCHING
        
        # Phase 1: Save current state (if any)
        if self.current_workload:
            await asyncio.sleep(0.05)  # 50ms to checkpoint
        
        # Phase 2: Clear GPU memory
        await asyncio.sleep(0.08)  # 80ms to clear
        
        # Phase 3: Load new workload
        await asyncio.sleep(0.12)  # 120ms to load
        
        # Phase 4: Initialize
        await asyncio.sleep(0.15)  # 150ms to initialize
        
        # Update state
        self.current_workload = new_workload
        self.state = ResourceState.RUNNING
        new_workload.started_at = time.time()
        
        switch_duration = (time.time() - switch_start) * 1000
        
        metrics = SwitchingMetrics(
            from_workload=from_type,
            to_workload=to_type,
            switch_time_ms=switch_duration,
            timestamp=time.time(),
            success=switch_duration < 500,  # Target is <500ms
            gpu_id=self.gpu_id
        )
        
        self.switching_metrics.append(metrics)
        
        print(f"[{self.gpu_id}] ✅ Switch completed in {switch_duration:.2f}ms")
        
        return metrics

    def get_utilization(self) -> float:
        """Get current GPU utilization"""
        if self.state == ResourceState.RUNNING:
            if self.current_workload.type == WorkloadType.AI_INFERENCE_REALTIME:
                return random.uniform(85, 95)
            elif self.current_workload.type == WorkloadType.BITCOIN_MINING:
                return random.uniform(95, 100)
            else:
                return random.uniform(70, 90)
        return 0.0

    def get_metrics(self) -> Dict:
        """Get current GPU metrics"""
        return {
            "gpu_id": self.gpu_id,
            "gpu_type": self.gpu_type,
            "state": self.state.value,
            "utilization": self.get_utilization(),
            "temperature": random.uniform(60, 80) if self.state == ResourceState.RUNNING else random.uniform(30, 45),
            "power_usage": random.uniform(300, 400) if self.state == ResourceState.RUNNING else random.uniform(50, 100),
            "current_workload": self.current_workload.id if self.current_workload else None,
        }

class ASICSimulator:
    """Simulates ASIC miners"""
    
    def __init__(self, asic_id: str, asic_type: str = "S21"):
        self.asic_id = asic_id
        self.asic_type = asic_type
        self.state = ResourceState.RUNNING
        self.hash_rate = 200  # TH/s
        
    def get_metrics(self) -> Dict:
        """Get current ASIC metrics"""
        return {
            "asic_id": self.asic_id,
            "asic_type": self.asic_type,
            "hash_rate_ths": self.hash_rate + random.uniform(-5, 5),
            "efficiency_j_th": 17.5 + random.uniform(-0.5, 0.5),
            "power_usage": random.uniform(3400, 3600),
            "temperature": random.uniform(55, 75),
            "uptime_hours": random.randint(100, 10000),
        }

class HybridComputeSimulator:
    """Main simulator orchestrating GPU and ASIC resources"""
    
    def __init__(self):
        # Create simulated resources
        self.gpus = [
            GPUSimulator(f"gpu-tx-{i:03d}", "H100") for i in range(10)
        ]
        self.asics = [
            ASICSimulator(f"asic-tx-{i:03d}", "S21") for i in range(20)
        ]
        
        self.workload_queue: list[Workload] = []
        self.completed_workloads: list[Workload] = []
        self.all_switching_metrics: list[SwitchingMetrics] = []
        
    async def submit_workload(self, workload_data: Dict) -> str:
        """Submit a new workload"""
        workload = Workload(
            id=f"wl-{int(time.time()*1000)}",
            type=WorkloadType(workload_data["type"]),
            priority=workload_data.get("priority", 5),
            gpu_count=workload_data.get("requirements", {}).get("gpu_count", 1),
            metrics={}
        )
        
        self.workload_queue.append(workload)
        print(f"📦 Workload submitted: {workload.id} ({workload.type.value})")
        
        # Immediately try to schedule
        await self.schedule_workloads()
        
        return workload.id

    async def schedule_workloads(self):
        """Schedule workloads to available GPUs"""
        # Sort by priority
        self.workload_queue.sort(key=lambda w: w.priority)
        
        for workload in self.workload_queue[:]:
            # Find available GPUs
            available_gpus = [
                gpu for gpu in self.gpus 
                if gpu.state in [ResourceState.IDLE, ResourceState.RUNNING]
            ][:workload.gpu_count]
            
            if len(available_gpus) >= workload.gpu_count:
                print(f"🎯 Scheduling {workload.id} to {len(available_gpus)} GPU(s)")
                
                # Switch workloads
                switch_tasks = [
                    gpu.switch_workload(workload) for gpu in available_gpus
                ]
                metrics = await asyncio.gather(*switch_tasks)
                
                # Record metrics
                self.all_switching_metrics.extend(metrics)
                
                # Remove from queue
                self.workload_queue.remove(workload)

    async def run_workloads(self):
        """Simulate running workloads"""
        while True:
            await asyncio.sleep(2)  # Check every 2 seconds
            
            # Randomly complete some workloads
            for gpu in self.gpus:
                if gpu.current_workload and random.random() < 0.1:
                    workload = gpu.current_workload
                    workload.completed_at = time.time()
                    self.completed_workloads.append(workload)
                    gpu.current_workload = None
                    gpu.state = ResourceState.IDLE
                    print(f"✅ Workload completed: {workload.id}")
            
            # Try to schedule queued workloads
            if self.workload_queue:
                await self.schedule_workloads()

    def get_system_metrics(self) -> Dict:
        """Get overall system metrics"""
        gpu_metrics = [gpu.get_metrics() for gpu in self.gpus]
        asic_metrics = [asic.get_metrics() for asic in self.asics]
        
        # Calculate switching performance
        recent_switches = self.all_switching_metrics[-100:]  # Last 100 switches
        if recent_switches:
            avg_switch_time = sum(m.switch_time_ms for m in recent_switches) / len(recent_switches)
            max_switch_time = max(m.switch_time_ms for m in recent_switches)
            min_switch_time = min(m.switch_time_ms for m in recent_switches)
            success_rate = sum(1 for m in recent_switches if m.success) / len(recent_switches) * 100
        else:
            avg_switch_time = max_switch_time = min_switch_time = 0
            success_rate = 100
        
        return {
            "timestamp": datetime.now().isoformat(),
            "gpus": {
                "total": len(self.gpus),
                "running": sum(1 for g in self.gpus if g.state == ResourceState.RUNNING),
                "switching": sum(1 for g in self.gpus if g.state == ResourceState.SWITCHING),
                "idle": sum(1 for g in self.gpus if g.state == ResourceState.IDLE),
                "avg_utilization": sum(g.get_utilization() for g in self.gpus) / len(self.gpus),
                "metrics": gpu_metrics[:5]  # Sample of 5
            },
            "asics": {
                "total": len(self.asics),
                "total_hash_rate_ths": sum(a.get_metrics()["hash_rate_ths"] for a in self.asics),
                "metrics": asic_metrics[:5]  # Sample of 5
            },
            "workloads": {
                "queued": len(self.workload_queue),
                "running": sum(1 for g in self.gpus if g.current_workload),
                "completed": len(self.completed_workloads),
            },
            "switching_performance": {
                "total_switches": len(self.all_switching_metrics),
                "avg_switch_time_ms": round(avg_switch_time, 2),
                "min_switch_time_ms": round(min_switch_time, 2),
                "max_switch_time_ms": round(max_switch_time, 2),
                "success_rate_percent": round(success_rate, 2),
                "target_ms": 500,
                "within_target": avg_switch_time < 500
            }
        }

    async def start_api_server(self):
        """Start HTTP API server for the simulator"""
        from aiohttp import web
        
        async def handle_submit(request):
            data = await request.json()
            workload_id = await self.submit_workload(data)
            return web.json_response({"workload_id": workload_id})
        
        async def handle_metrics(request):
            metrics = self.get_system_metrics()
            return web.json_response(metrics)
        
        async def handle_switching_metrics(request):
            return web.json_response({
                "total_switches": len(self.all_switching_metrics),
                "recent_switches": [
                    asdict(m) for m in self.all_switching_metrics[-20:]
                ]
            })
        
        app = web.Application()
        app.router.add_post('/submit', handle_submit)
        app.router.add_get('/metrics', handle_metrics)
        app.router.add_get('/switching', handle_switching_metrics)
        
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, 'localhost', 8090)
        await site.start()
        
        print("🚀 Simulator API running on http://localhost:8090")

async def main():
    """Main entry point"""
    print("=" * 70)
    print("🏗️  MARA HCP - ENHANCED HYBRID COMPUTE SIMULATOR")
    print("=" * 70)
    
    simulator = HybridComputeSimulator()
    
    # Start API server
    await simulator.start_api_server()
    
    # Start workload execution loop
    execution_task = asyncio.create_task(simulator.run_workloads())
    
    # Demo: Submit some test workloads
    print("\n📦 Submitting demo workloads...")
    await asyncio.sleep(2)
    
    await simulator.submit_workload({
        "type": "bitcoin_mining",
        "priority": 3,
        "requirements": {"gpu_count": 2}
    })
    
    await asyncio.sleep(5)
    
    await simulator.submit_workload({
        "type": "ai_inference_realtime",
        "priority": 1,
        "requirements": {"gpu_count": 2}
    })
    
    # Print metrics periodically
    while True:
        await asyncio.sleep(10)
        metrics = simulator.get_system_metrics()
        print("\n" + "=" * 70)
        print(f"📊 SYSTEM METRICS - {metrics['timestamp']}")
        print("=" * 70)
        print(f"GPUs: {metrics['gpus']['running']}/{metrics['gpus']['total']} running")
        print(f"Avg Utilization: {metrics['gpus']['avg_utilization']:.1f}%")
        print(f"ASICs: {metrics['asics']['total_hash_rate_ths']:.1f} TH/s")
        print(f"Workloads: {metrics['workloads']['queued']} queued, "
              f"{metrics['workloads']['running']} running, "
              f"{metrics['workloads']['completed']} completed")
        print(f"\n⚡ Switching Performance:")
        print(f"   Total Switches: {metrics['switching_performance']['total_switches']}")
        print(f"   Avg Time: {metrics['switching_performance']['avg_switch_time_ms']}ms")
        print(f"   Success Rate: {metrics['switching_performance']['success_rate_percent']}%")
        print(f"   Within Target (<500ms): {'✅ YES' if metrics['switching_performance']['within_target'] else '❌ NO'}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n👋 Simulator stopped")

