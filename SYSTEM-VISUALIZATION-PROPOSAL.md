# MARA HCP - System Visualization & Real-Time Diagram Proposal

**Version:** 1.0  
**Last Updated:** October 24, 2025

---

## Executive Summary

This document proposes implementing **interactive, real-time system diagrams** within the MARA HCP dashboard and simulation environment. These diagrams will visualize:

1. **System Architecture** - Live component topology
2. **Message Flow** - Real-time data flow visualization
3. **Resource State** - GPU/ASIC status and allocation
4. **Switching Events** - Animated workload transitions
5. **Performance Metrics** - Latency heatmaps and bottlenecks

---

## Why Visual Diagrams Matter

### Current State (Static Documentation)

The current documentation includes ASCII diagrams that are:
- ✅ Helpful for understanding architecture
- ✅ Easy to include in markdown
- ❌ **Static** - don't reflect real-time state
- ❌ **Not interactive** - can't drill down
- ❌ **Limited detail** - ASCII art constraints

### Proposed State (Interactive Dashboard)

Real-time diagrams would provide:
- ✅ **Live system state** - See actual resource allocation
- ✅ **Interactive exploration** - Click components for details
- ✅ **Animated flows** - Watch messages traverse the system
- ✅ **Problem identification** - Visual bottleneck detection
- ✅ **Training tool** - Helps new users understand the system

---

## Proposed Visualizations

### 1. Live System Topology Diagram

**What It Shows:**
- All microservices and their health status
- Active connections between services
- Current request volume (thickness of lines)
- Service latency (color-coded)

**Example Mockup:**

```
┌──────────────────────────────────────────────────────────────┐
│  MARA HCP - Live System Topology          [Refresh: 2s] 🔄  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     Frontend                                 │
│               ┌──────────────────┐                           │
│               │   React App      │                           │
│               │   🟢 Healthy     │                           │
│               │   124 users      │                           │
│               └────────┬─────────┘                           │
│                        │                                     │
│                        │ 847 req/s                           │
│                        ▼                                     │
│               ┌──────────────────┐                           │
│               │   Kong Gateway   │                           │
│               │   🟢 3 replicas  │                           │
│               │   Latency: 8ms   │                           │
│               └───────┬──────────┘                           │
│                       │                                      │
│        ┌──────────────┼──────────────┐                      │
│        │              │              │                      │
│        ▼              ▼              ▼                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │Orchestr..│  │Optimizer │  │ Router   │                 │
│  │🟢 3/3    │  │🟢 3/3    │  │🟢 5/5    │                 │
│  │12ms      │  │6ms       │  │18ms      │                 │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                 │
│       │             │             │                        │
│       └─────────────┼─────────────┘                        │
│                     │                                      │
│                     ▼                                      │
│             ┌──────────────┐                               │
│             │  Resource    │                               │
│             │  Manager     │                               │
│             │  🟢 3/3      │                               │
│             │  22ms        │                               │
│             └──────┬───────┘                               │
│                    │                                       │
│      ┌─────────────┼─────────────┐                        │
│      │             │             │                        │
│      ▼             ▼             ▼                        │
│  ┌────────┐   ┌────────┐   ┌────────┐                    │
│  │ H100   │   │ A100   │   │ S21    │                    │
│  │ GPUs   │   │ GPUs   │   │ ASICs  │                    │
│  │ 89%    │   │ 76%    │   │ 100%   │                    │
│  │ 🔥45°C │   │ 🔥52°C │   │ 🔥68°C │                    │
│  └────────┘   └────────┘   └────────┘                    │
│                                                            │
│  [Click any component for details]                        │
│                                                            │
│  Legend:                                                  │
│  🟢 Healthy   🟡 Degraded   🔴 Failed                     │
│  Line thickness = request volume                          │
│  Color = latency (green <50ms, yellow <100ms, red >100ms)│
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**Interactive Features:**
- **Hover over service**: Shows detailed metrics popup
- **Click service**: Opens detailed service panel
- **Hover over connection**: Shows request rate, latency, error rate
- **Auto-refresh**: Updates every 2-5 seconds
- **Zoom/Pan**: Explore large topology

### 2. Message Flow Animation

**What It Shows:**
- Animated visualization of requests flowing through the system
- Color-coded by workload type
- Latency displayed at each hop
- Queue depth indicators

**Example Mockup:**

```
┌──────────────────────────────────────────────────────────────┐
│  Message Flow Visualization         [Playback Speed: 1x] ▶  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Customer                                                    │
│  Dashboard                                                   │
│      │                                                       │
│      │ POST /workloads                                      │
│      │ {"type": "ai_inference", ...}                       │
│      │                                                       │
│      ●─────────────────────┐ [Message traveling...]         │
│                            │                                 │
│                            ▼                                 │
│                     Kong Gateway                             │
│                            │                                 │
│                            │ +10ms                           │
│                            ●─────────────────────┐           │
│                                                  │           │
│                                                  ▼           │
│                                           Orchestrator       │
│                                                  │           │
│                                                  │ +15ms     │
│                                                  ●────────┐  │
│                                                           │  │
│  [Timeline]                                              ▼  │
│  0ms ─────── 10ms ────── 25ms ────── 450ms              Router│
│                                                              │
│  Recent Messages:                                            │
│  🔵 W-123 (AI Inference) → Router → Resource Mgr (450ms)   │
│  🟢 W-122 (Batch Job)    → Completed (2.3s)                │
│  🟡 W-121 (Mining)       → Running (continuous)            │
│                                                              │
│  [Pause] [Step Forward] [Speed: 0.5x 1x 2x 10x]            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Interactive Features:**
- **Playback control**: Pause, play, speed up/slow down
- **Click message**: Follow specific message through system
- **Filter by type**: Show only AI/Mining/Batch messages
- **Highlight path**: See critical path for latency
- **Export**: Save animation as video or GIF

### 3. Resource State Heatmap

**What It Shows:**
- All GPUs/ASICs in a grid
- Color-coded by temperature, utilization, or profitability
- Animated switching events
- Facility grouping

**Example Mockup:**

```
┌──────────────────────────────────────────────────────────────┐
│  Resource Heatmap              View: [Temperature ▼]         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Texas North Facility                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GPU CLUSTER                                         │  │
│  │  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                  │  │
│  │  │█│█│▓│▓│░│░│█│▓│░│█│▓│░│▓│█│▓│░│ Row 1 (H100)    │  │
│  │  ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤                  │  │
│  │  │▓│░│█│▓│░│█│▓│░│▓│█│▓│█│░│▓│█│▓│ Row 2 (H100)    │  │
│  │  ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤                  │  │
│  │  │░│▓│░│█│▓│░│▓│█│▓│░│▓│█│▓│░│▓│█│ Row 3 (A100)    │  │
│  │  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘                  │  │
│  │                                                       │  │
│  │  ASIC CLUSTER                                        │  │
│  │  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐ (100 ASICs)     │  │
│  │  │█│█│█│█│█│█│█│█│█│█│█│█│█│█│█│█│ Container 1     │  │
│  │  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Temperature Legend:                                         │
│  ░ <50°C (Cool)  ▓ 50-70°C (Normal)  █ >70°C (Hot)         │
│                                                              │
│  Hover for details: GPU-TX-H100-023                         │
│  ┌─────────────────────────────────────┐                    │
│  │ Status: Running AI Inference        │                    │
│  │ Temp: 68°C                          │                    │
│  │ Power: 650W                         │                    │
│  │ Utilization: 95%                    │                    │
│  │ Workload: W-abc123 (Acme Corp)      │                    │
│  │ Uptime: 2h 15m                      │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
│  Views: [Temperature] [Utilization] [Profitability]         │
│         [Workload Type] [Customer]                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Interactive Features:**
- **Multiple views**: Switch between temperature, utilization, profitability
- **Click resource**: Open detailed resource page
- **Filter**: Show only available, allocated, or specific type
- **Animated switching**: Highlight resources during switching (pulsing border)
- **Export**: Download heatmap as image

### 4. Switching Event Timeline

**What It Shows:**
- Chronological log of all switching events
- Latency for each switching operation
- Success/failure indicators
- Detailed breakdown of each phase

**Example Mockup:**

```
┌──────────────────────────────────────────────────────────────┐
│  Switching Events Timeline              [Last 24 hours]      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  10:45:23 ─ GPU-TX-H100-023 ─ Bitcoin → AI Inference       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Total: 442ms ✅                                       │  │
│  │                                                       │  │
│  │ Timeline:                                            │  │
│  │ 0ms     50ms   100ms  200ms  350ms  442ms           │  │
│  │ ├───────┼──────┼──────┼──────┼──────┤              │  │
│  │ Pause   Save   Switch Load   Health                 │  │
│  │ (45ms)  (38ms) (185ms)(132ms)(42ms)                │  │
│  │                                                       │  │
│  │ Resource: GPU-TX-H100-023 (Texas North)             │  │
│  │ Trigger: Economic signal (BTC price drop)           │  │
│  │ New Workload: W-abc123 (Acme Corp)                  │  │
│  │ Confidence: 95%                                      │  │
│  │ Profit Delta: +$6.30/hour (+77%)                    │  │
│  │                                                       │  │
│  │ [View Full Details] [Replay Animation]              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  10:42:18 ─ GPU-TX-H100-087 ─ AI Inference → Maintenance   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Total: N/A (Manual trigger)                          │  │
│  │ Reason: High temperature alert (89°C)               │  │
│  │ [View Details]                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  10:38:05 ─ GPU-TX-A100-045 ─ Mining → AI Batch           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Total: 681ms ⚠️ (Slow - P99 latency)                 │  │
│  │ Bottleneck: Redis save (142ms)                      │  │
│  │ [View Details] [Flag for Review]                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Statistics (Last 24h):                                     │
│  ├─ Total Switches: 1,247                                  │
│  ├─ Success Rate: 99.8%                                    │
│  ├─ Avg Latency: 442ms (target: <500ms) ✅                │
│  ├─ P50: 428ms  P95: 589ms  P99: 712ms                    │
│  └─ Failures: 3 (all due to hardware errors)              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5. Profitability Dashboard with Real-Time Charts

**What It Shows:**
- Live profitability calculations
- Bitcoin vs. AI profitability comparison
- Historical trends
- Switching recommendations

**Example Mockup:**

```
┌──────────────────────────────────────────────────────────────┐
│  Economic Optimization Dashboard                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  CURRENT PROFITABILITY                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ Bitcoin Mining      │  │ AI Inference        │          │
│  │                     │  │                     │          │
│  │   $8.50/hour        │  │   $14.00/hour       │          │
│  │                     │  │                     │          │
│  │   ▼ -2.3%           │  │   ▲ +5.7%           │          │
│  │   (vs. 1h ago)      │  │   (vs. 1h ago)      │          │
│  │                     │  │                     │          │
│  │ 🔵 38% of resources │  │ 🟢 62% of resources │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│  RECOMMENDATION: Allocate more to AI (+$6.30/hr profit)    │
│                                                              │
│  LIVE CHART (Profitability over time)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ $20│                                                   │ │
│  │    │                            ╱──────╲              │ │
│  │ $15│                    ╱──────╱        ╲────────     │ │
│  │    │            ╱──────╱                              │ │
│  │ $10│   ╱───────╱                                      │ │
│  │    │  ╱                                               │ │
│  │  $5│ ╱                                                │ │
│  │    └────────────────────────────────────────────────  │ │
│  │      10:00    11:00    12:00    13:00    14:00       │ │
│  │                                                       │ │
│  │  ── AI Inference    ── Bitcoin Mining                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  MARKET DATA (Live Updates)                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ BTC Price:        $66,234.50  ▲ +1.2%               │  │
│  │ Electricity:      $0.035/kWh  ▼ -8.5%               │  │
│  │ GPU Spot Rate:    $48.00/hr   ▲ +3.1%               │  │
│  │ Network Diff:     70.2T       ▲ +0.5%               │  │
│  │                                                       │  │
│  │ Last Updated: 2 seconds ago 🔄                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  SWITCHING HISTORY (Last 6 Hours)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    │                                                   │ │
│  │    │         🔄    🔄🔄    🔄🔄🔄                       │ │
│  │    │   🔄   │     │        │                          │ │
│  │    │  │     │     │        │                          │ │
│  │    └─────────┼─────────────┼──────────────────────    │ │
│  │      08:00   10:00   12:00   14:00                    │ │
│  │                                                       │ │
│  │  Each 🔄 = Switch event (hover for details)          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Technology Stack for Visualization

**1. Frontend Library: D3.js + React Flow**

```javascript
// Example: Live System Topology
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';

function SystemTopology() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // WebSocket connection for live updates
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8086/topology');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Update nodes (services)
      setNodes(data.services.map(service => ({
        id: service.id,
        type: 'custom',
        data: { 
          label: service.name,
          health: service.health,
          latency: service.latency,
          replicas: service.replicas
        },
        position: service.position,
        style: {
          background: getHealthColor(service.health),
          border: '2px solid #3B82F6',
        }
      })));
      
      // Update edges (connections)
      setEdges(data.connections.map(conn => ({
        id: `${conn.from}-${conn.to}`,
        source: conn.from,
        target: conn.to,
        animated: conn.requestRate > 100,
        style: {
          stroke: getLatencyColor(conn.latency),
          strokeWidth: Math.min(conn.requestRate / 100, 10)
        },
        label: `${conn.requestRate} req/s`
      })));
    };
    
    return () => ws.close();
  }, []);
  
  return (
    <div style={{ height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

**2. Real-Time Data Pipeline**

```
Backend Services ──▶ Redis Pub/Sub ──▶ WebSocket Service ──▶ Frontend
    (metrics)        (aggregation)      (broadcast)         (visualization)
```

**Backend (Go) - Publish topology updates:**

```go
// In Resource Manager
func (rm *ResourceManager) publishTopologyUpdate() {
    topology := rm.buildTopology()
    
    data, _ := json.Marshal(topology)
    
    // Publish to Redis channel
    rm.redis.Publish(ctx, "topology-updates", data)
}

func (rm *ResourceManager) buildTopology() Topology {
    return Topology{
        Services: []Service{
            {
                ID: "orchestrator",
                Name: "Core Orchestrator",
                Health: rm.getServiceHealth("orchestrator"),
                Latency: rm.getServiceLatency("orchestrator"),
                Replicas: 3,
                Position: {X: 400, Y: 100},
            },
            // ... other services
        },
        Connections: []Connection{
            {
                From: "kong",
                To: "orchestrator",
                RequestRate: rm.getRequestRate("kong", "orchestrator"),
                Latency: rm.getConnectionLatency("kong", "orchestrator"),
            },
            // ... other connections
        },
    }
}
```

**3. Animation Library: Anime.js**

```javascript
// Example: Animated message flow
import anime from 'animejs';

function MessageFlowAnimation({ messages }) {
  useEffect(() => {
    messages.forEach((msg, idx) => {
      anime({
        targets: `.message-${msg.id}`,
        translateX: msg.path.map(p => p.x),
        translateY: msg.path.map(p => p.y),
        duration: msg.duration,
        delay: idx * 200, // Stagger animations
        easing: 'easeInOutQuad',
        complete: () => {
          // Message reached destination
          onMessageComplete(msg);
        }
      });
    });
  }, [messages]);
  
  return (
    <svg width="100%" height="600">
      {messages.map(msg => (
        <circle
          key={msg.id}
          className={`message-${msg.id}`}
          r="8"
          fill={getMessageColor(msg.type)}
        />
      ))}
    </svg>
  );
}
```

### Performance Considerations

**Challenge**: Rendering 896 GPUs + 33,000 ASICs in real-time

**Solutions:**

1. **Virtualization**: Only render visible resources
```javascript
import { FixedSizeGrid } from 'react-window';

function ResourceGrid({ resources }) {
  // Only renders visible cells
  return (
    <FixedSizeGrid
      height={600}
      width={800}
      columnCount={50}
      rowCount={Math.ceil(resources.length / 50)}
      columnWidth={20}
      rowHeight={20}
    >
      {({ columnIndex, rowIndex, style }) => {
        const resource = resources[rowIndex * 50 + columnIndex];
        return (
          <div style={style}>
            <ResourceCell resource={resource} />
          </div>
        );
      }}
    </FixedSizeGrid>
  );
}
```

2. **Data Aggregation**: Group resources by facility/rack
```javascript
// Instead of 33,000 individual ASICs, show 100 containers
const aggregated = resources.reduce((acc, resource) => {
  const key = resource.container_id;
  acc[key] = {
    ...acc[key],
    count: (acc[key]?.count || 0) + 1,
    avgTemp: ((acc[key]?.avgTemp || 0) + resource.temp) / 2,
    totalPower: (acc[key]?.totalPower || 0) + resource.power,
  };
  return acc;
}, {});
```

3. **Throttled Updates**: Don't update UI on every metric
```javascript
const throttledUpdate = useCallback(
  throttle((newData) => {
    setVisualizationData(newData);
  }, 2000), // Update UI max every 2 seconds
  []
);
```

4. **Canvas Rendering**: For heatmaps, use Canvas instead of SVG/DOM
```javascript
function ResourceHeatmap({ resources }) {
  const canvasRef = useRef();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each resource as a colored square
    resources.forEach((resource, idx) => {
      const x = (idx % 50) * 20;
      const y = Math.floor(idx / 50) * 20;
      ctx.fillStyle = getTempColor(resource.temp);
      ctx.fillRect(x, y, 18, 18);
    });
  }, [resources]);
  
  return <canvas ref={canvasRef} width={1000} height={600} />;
}
```

---

## Implementation Roadmap

### Phase 1: Basic Topology Diagram (Sprint 15)
**Duration**: 1 week  
**Deliverables**:
- Static system topology using React Flow
- Manual refresh button
- Basic service health indicators
- Click to view service details

### Phase 2: Real-Time Updates (Sprint 16)
**Duration**: 1 week  
**Deliverables**:
- WebSocket integration for live updates
- Auto-refresh every 2-5 seconds
- Animated connection lines (request flow)
- Latency color-coding

### Phase 3: Resource Heatmap (Sprint 17)
**Duration**: 1 week  
**Deliverables**:
- Canvas-based heatmap (for performance)
- Temperature/Utilization/Profitability views
- Hover tooltips with resource details
- Facility grouping

### Phase 4: Message Flow Animation (Sprint 18)
**Duration**: 2 weeks  
**Deliverables**:
- Animated message flow visualization
- Playback controls (pause, speed, step)
- Filter by message type
- Export animation

### Phase 5: Switching Timeline & Analytics (Sprint 19)
**Duration**: 1 week  
**Deliverables**:
- Chronological switching event log
- Latency breakdown per phase
- Statistics dashboard
- Anomaly detection (slow switches)

### Phase 6: Interactive Profitability Dashboard (Sprint 20)
**Duration**: 1 week  
**Deliverables**:
- Live profitability chart (D3.js)
- Market data widgets
- Switching recommendation alerts
- Historical trend analysis

---

## Example: Complete Visualization Page in Dashboard

**New Menu Item**: "System Visualization" (Admin only)

**Page Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ SYSTEM VISUALIZATION                    [Admin] [Help]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Tabs]                                                      │
│  • Live Topology                                             │
│  • Message Flow                                              │
│  • Resource Heatmap                                          │
│  • Switching Timeline                                        │
│  • Profitability                                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │          (Full-screen interactive diagram)            │ │
│  │                                                        │ │
│  │          React Flow / D3.js / Canvas visualization    │ │
│  │                                                        │ │
│  │          Updated in real-time via WebSocket           │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Controls]                                                  │
│  🔄 Auto-refresh: ON (2s)  |  🔍 Zoom: 100%  |  📷 Export  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Benefits Summary

### For Developers
✅ **Faster debugging** - Visual identification of bottlenecks  
✅ **System understanding** - See how components interact  
✅ **Performance tuning** - Identify slow services  

### For Operations
✅ **Real-time monitoring** - Live system state  
✅ **Problem detection** - Visual alerts (red services)  
✅ **Capacity planning** - Resource utilization at a glance  

### For Customers
✅ **Transparency** - See where workload is executing  
✅ **Trust** - Understand the platform complexity  
✅ **Troubleshooting** - Visualize latency issues  

### For Executives
✅ **Business metrics** - Profitability visualization  
✅ **Demonstrations** - Impressive live demos  
✅ **Investor pitch** - Show off the technology  

---

## Conclusion

Adding **real-time, interactive system diagrams** to the MARA HCP dashboard would:

1. **Significantly improve** system observability
2. **Accelerate** problem diagnosis and resolution
3. **Enhance** user trust and engagement
4. **Provide** a powerful tool for training and onboarding
5. **Differentiate** MARA HCP from competitors

The implementation is **feasible** using modern web technologies (React Flow, D3.js, Canvas API) and can be **phased** over 6 sprints (6-8 weeks) without disrupting existing functionality.

**Recommendation**: Proceed with Phase 1 (Basic Topology) immediately, as it provides high value with relatively low effort.

---

*Questions or feedback? Discuss in the next sprint planning meeting.*

*Last Updated: October 24, 2025*  
*Author: MARA HCP Engineering Team*

