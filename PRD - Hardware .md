# Product Requirements Document \- Hardware

## MARA Hybrid Compute Platform (HCP)

**Document Version**: 1.0  
**Date**: October 2024  
**Product Owner**: MARA Infrastructure Division  
**Target Deployment**: Q2 2025 (Phase 1), Q4 2025 (Full Scale)

---

## 1\. Executive Summary

This document defines the hardware requirements for MARA's Hybrid Compute Platform, supporting dynamic allocation between Bitcoin mining (ASICs) and AI inference (GPUs). The platform will scale to 50,000 GPUs and 250,000 ASICs across multiple facilities, requiring advanced cooling, power distribution, and networking infrastructure.

### Design Principles

- Modularity: Standardized units for rapid deployment  
- Efficiency: Target PUE \<1.2 with heat recovery  
- Flexibility: Support workload switching in \<100ms  
- Sustainability: 70%+ renewable energy, 85% heat recovery  
- Reliability: N+1 redundancy, 99.99% uptime

---

## 2\. Facility Architecture

### 2.1 Hybrid Data Center Layout (200MW Facility)

**Facility Overview:**

- 4 Main Compute Halls (50MW each)  
  - 2 GPU Halls: High-density liquid-cooled infrastructure  
  - 2 ASIC Halls: Immersion/air-cooled mining infrastructure  
- Central Dynamic Resource Control Center  
- Dual cooling plants with heat recovery  
- Intelligent power distribution with rapid switching capability  
- Network core with SDN orchestration

### 2.2 Space Requirements

| Zone | Area (sq ft) | Height (ft) | Power Density |
| :---- | :---- | :---- | :---- |
| GPU Halls | 40,000 | 14 | 50-75 kW/rack |
| ASIC Halls | 40,000 | 12 | 30-40 kW/rack |
| Cooling Plant | 20,000 | 20 | N/A |
| Power/Electrical | 15,000 | 16 | N/A |
| Network Core | 5,000 | 14 | 10 kW/rack |
| Office/NOC | 5,000 | 10 | Standard |
| **Total** | **125,000** | \- | \- |

---

## 3\. GPU Infrastructure

### 3.1 GPU Specifications

**Primary Configuration**: NVIDIA H100 80GB HBM3

| Specification | Requirement | Notes |
| :---- | :---- | :---- |
| Model | NVIDIA H100 80GB | Primary; L40S for cost-sensitive |
| Form Factor | SXM5 | PCIe for flexibility |
| TDP | 700W | Per GPU maximum |
| Memory | 80GB HBM3 | 3.35TB/s bandwidth |
| Interconnect | NVLink 4.0 | 900GB/s GPU-to-GPU |
| Quantity Phase 1 | 10,000 units | Including Exaion's 1,250 |
| Quantity Phase 2 | 40,000 units | By end of 2026 |

### 3.2 GPU Server Configuration

**Standard GPU Node**: 8x H100 Configuration

server\_spec:

  chassis: 4U rackmount

  cpus: 2x AMD EPYC 9654 (96 cores)

  ram: 2TB DDR5

  gpus: 8x NVIDIA H100 80GB

  storage: 

    \- 2x 1.92TB NVMe (OS)

    \- 8x 7.68TB NVMe (data)

  network:

    \- 8x 200Gbps InfiniBand (GPU fabric)

    \- 2x 100Gbps Ethernet (management)

  power: 

    \- 6x 3000W PSU (N+2 redundancy)

    \- Total draw: \~8kW per node

  cooling: Direct-to-chip liquid cooling

### 3.3 GPU Cluster Architecture

**Pod Design**: 32 nodes (256 GPUs) per pod

| Component | Specification | Quantity per Pod |
| :---- | :---- | :---- |
| GPU Nodes | 8x H100 servers | 32 |
| Top-of-Rack Switch | InfiniBand 64-port | 2 |
| Storage Node | 1PB all-flash | 4 |
| Management Node | Standard server | 2 |
| PDUs | 415V, 3-phase | 8 |
| **Total Power** | \~300kW | Per pod |

---

## 4\. ASIC Mining Infrastructure

### 4.1 ASIC Specifications

**Primary Models**:

| Model | Hash Rate | Power | Efficiency | Quantity |
| :---- | :---- | :---- | :---- | :---- |
| Antminer S21 XP | 270 TH/s | 3,645W | 13.5 J/TH | 100,000 |
| Whatsminer M50S | 260 TH/s | 3,380W | 13.0 J/TH | 75,000 |
| Antminer S19 XP | 140 TH/s | 3,010W | 21.5 J/TH | 75,000 |

### 4.2 ASIC Deployment Configuration

**Container Design**: 40ft ISO container modules

container\_spec:

  dimensions: 40' x 8' x 8.5'

  capacity: 200 ASICs

  power: 750kW

  cooling: Immersion or air-cooled

  network: 

    \- 1x 10Gbps uplink

    \- Internal 1Gbps switching

  environmental:

    \- Temperature: \-20°C to 45°C operational

    \- Humidity: 5% to 95% non-condensing

    \- Filtration: MERV 13 filters

### 4.3 Mining Pool Infrastructure

| Component | Specification | Redundancy |
| :---- | :---- | :---- |
| Stratum Proxy | 10Gbps, \<1ms latency | N+2 |
| Pool Servers | On-premise \+ cloud | Active-active |
| Backup Pools | 3 configured | Automatic failover |

---

## 5\. Power Infrastructure

### 5.1 Primary Power Supply

**Utility Connection**: 200MW capacity

| Component | Specification | Details |
| :---- | :---- | :---- |
| Voltage | 138kV | Primary feed |
| Substations | 2x 100MW | N+1 redundancy |
| Transformers | 138kV to 13.8kV | 8x 25MVA units |
| Distribution | 13.8kV to 480V | Facility level |
| Power Factor | \>0.95 | Active correction |

### 5.2 Power Distribution Architecture

138kV Utility Feed

        │

    Substation

        │

    13.8kV Bus

        ├─────────────┬─────────────┬─────────────┐

        │             │             │             │

    GPU Hall 1    GPU Hall 2   ASIC Hall 1   ASIC Hall 2

     (50MW)        (50MW)        (50MW)        (50MW)

        │             │             │             │

    480V PDUs     480V PDUs    415V PDUs     415V PDUs

### 5.3 Backup Power Systems

| System | Capacity | Runtime | Start Time |
| :---- | :---- | :---- | :---- |
| UPS Systems | 10MW | 15 minutes | Instant |
| Diesel Generators | 50MW | 48 hours | \<10 seconds |
| Battery Storage | 20MWh | 2 hours | Instant |
| Fuel Storage | 100,000 gallons | 48 hours @ full load | N/A |

### 5.4 Dynamic Power Management

**Intelligent PDUs**: Requirements

| Feature | Specification | Purpose |
| :---- | :---- | :---- |
| Monitoring | Per-outlet metering | Track individual ASIC/GPU |
| Control | Remote on/off | Enable rapid switching |
| Analytics | Power quality monitoring | Detect issues |
| Integration | SNMP, Modbus, REST API | Platform integration |
| Response Time | \<50ms switching | Support workload migration |

---

## 6\. Dynamic Resource Switching Hardware

### 6.1 Intelligent Power Switching System

**Automated Transfer Switches (ATS) with Sub-Cycle Switching**

| Component | Specification | Purpose | Quantity |
| :---- | :---- | :---- | :---- |
| High-Speed ATS | ABB TruONE, \<4ms transfer | Zone power routing | 40 units |
| Smart Breakers | SEL-352, programmable | Rapid isolation/connection | 200 units |
| Synchronization Units | GPS time sync, \<1μs accuracy | Coordinated switching | 8 units |
| Power Controllers | Modular 2MW blocks | Granular control | 100 units |
| Static Transfer Switch | Cyberex STS, \<1/4 cycle | Critical loads | 20 units |

**Dynamic Power Orchestration Controller**

power\_orchestrator:

  model: Custom FPGA-based controller

  response\_time: \<50ms

  capabilities:

    \- Real-time load monitoring

    \- Predictive load balancing

    \- Soft-start sequencing

    \- Harmonic mitigation

    \- Power factor correction

  interfaces:

    \- Modbus TCP/IP

    \- DNP3

    \- IEC 61850

    \- REST API

  redundancy: Triple-redundant controllers

### 6.2 Network Switching & Routing Hardware

**Software-Defined Networking (SDN) Infrastructure**

| Layer | Hardware | Capability | Response Time |
| :---- | :---- | :---- | :---- |
| SDN Controller | Arista CloudVision | Central orchestration | \<10ms |
| Spine Switches | Arista 7800R3 | 25.6 Tbps, programmable | \<1ms |
| Smart ToR | Arista 7060X5 | P4 programmable | \<100μs |
| Load Balancers | F5 BIG-IP i15800 | 320 Gbps L4-L7 | \<1ms |
| Traffic Director | NVIDIA BlueField-3 DPU | Hardware acceleration | \<10μs |

**Intelligent Network Interface Cards (SmartNICs)**

smartnic\_specs:

  model: NVIDIA ConnectX-7

  features:

    \- Hardware packet steering

    \- RDMA offload

    \- Inline crypto/compression

    \- Programmable pipeline

    \- SR-IOV with 256 VFs

  switching\_capability:

    \- Zero-downtime migration

    \- Dynamic VLAN assignment

    \- QoS enforcement

    \- Traffic isolation

### 6.3 Compute Resource Controllers

**GPU Orchestration Hardware**

| Component | Model | Function | Capacity |
| :---- | :---- | :---- | :---- |
| GPU Fabric Manager | NVIDIA UFM | InfiniBand orchestration | 10,000 ports |
| MIG Controller | Custom FPGA | GPU partitioning | 100μs reconfiguration |
| Memory Pool Manager | CXL Controller | Disaggregated memory | 100TB pool |
| Job Scheduler HW | Slurm \+ DPU | Hardware scheduling | 10,000 jobs/sec |

**ASIC Farm Controllers**

mining\_controllers:

  hashrate\_director:

    type: Custom ASIC controller

    features:

      \- Pool switching: \<100ms

      \- Frequency scaling: Real-time

      \- Power capping: Per-device

      \- Remote reset: \<1 second

  management\_hardware:

    \- Beaglebone controllers: 1 per 50 ASICs

    \- Raspberry Pi monitors: 1 per container

    \- FPGA aggregators: 1 per 1000 ASICs

### 6.4 Thermal Management Transition Hardware

**Dynamic Cooling Controllers**

| System | Component | Specification | Purpose |
| :---- | :---- | :---- | :---- |
| Variable Speed Drives | ABB ACS880 | 0-100% in 2s | Pump/fan control |
| Flow Control Valves | Belimo 6-way | \<5s actuation | Flow redirection |
| Thermal Storage | Phase-change material | 10MWh capacity | Buffer during transitions |
| CDU Controllers | Motivair ChilledDoor+ | Variable setpoint | Temperature adjustment |
| Heat Exchangers | Alfa Laval T20 | Modular 5MW units | Rapid heat transfer |

**Predictive Thermal Controller**

thermal\_controller:

  sensors:

    \- RTD temperature: 1000+ points

    \- Flow meters: 200+ locations

    \- Pressure sensors: 500+ points

    \- Humidity sensors: 100+ zones

  control\_logic:

    \- PID loops: 50 independent zones

    \- Predictive model: 15-min lookahead

    \- Emergency response: \<1 second

  actuation:

    \- Valve positioning: ±0.1%

    \- Pump speed: 0-100% variable

    \- Fan speed: 0-100% variable

### 6.5 Hardware Security & Isolation Systems

**Workload Isolation Hardware**

| Component | Specification | Purpose |
| :---- | :---- | :---- |
| Hardware Security Modules | Thales Luna HSM | Key management |
| Trusted Platform Modules | TPM 2.0 on all servers | Secure boot |
| Network Segmentation | VLAN \+ VXLAN | Workload isolation |
| Firewall Appliances | Palo Alto PA-7080 | 500 Gbps inspection |
| DDoS Mitigation | Radware DefensePro | 440 Gbps protection |

### 6.6 Monitoring & Telemetry Hardware

**Real-Time Monitoring Infrastructure**

monitoring\_hardware:

  power\_monitors:

    model: Schneider PM8000

    sampling\_rate: 256 samples/cycle

    accuracy: 0.1% 

    locations: Every PDU branch

    

  network\_taps:

    model: Gigamon GigaVUE-HC3

    capability: 100G line-rate

    features:

      \- SSL decryption

      \- Packet deduplication

      \- Flow generation

      

  environmental\_sensors:

    temperature: ±0.1°C accuracy

    humidity: ±2% RH

    airflow: ±3% CFM

    vibration: 3-axis accelerometer

    smoke: VESDA aspirating

    water: Rope sensors

### 6.7 Edge Computing for Local Processing

**Edge Controllers for Rapid Decision Making**

| Location | Hardware | Function | Latency |
| :---- | :---- | :---- | :---- |
| Rack Level | NVIDIA Jetson AGX | Local optimization | \<1ms |
| Row Level | Intel NUC clusters | Aggregation | \<5ms |
| Hall Level | Dell PowerEdge XE9680 | Zone control | \<10ms |
| Facility Level | HPE Apollo 6500 | Global optimization | \<50ms |

**Local Decision Engine Specs**

edge\_compute:

  per\_rack:

    cpu: 8-core ARM

    ram: 32GB

    storage: 1TB NVMe

    ml\_accelerator: Coral TPU

    decision\_time: \<100μs

    

  per\_zone:

    servers: 4x edge servers

    gpus: 4x T4 for inference

    networking: 100Gbps interconnect

    redundancy: Active-active

### 6.8 Rapid Provisioning Hardware

**Automated Provisioning Systems**

| System | Component | Capability | Speed |
| :---- | :---- | :---- | :---- |
| PXE Boot Servers | Dell R750 | Network booting | 1000 nodes/hour |
| Image Servers | NetApp AFF-A800 | OS deployment | 10Gbps throughput |
| Configuration Mgmt | Ansible Tower cluster | Automation | 5000 tasks/min |
| BMC Controllers | Redfish compliant | Remote management | Parallel ops |
| Zero-Touch Switches | Arista ZTP | Auto-configuration | \<5 minutes |

### 6.9 Load Balancing Hardware

**Multi-Tier Load Balancing**

load\_balancing\_tiers:

  global:

    device: F5 BIG-IP DNS

    capability: Geo-distributed

    decisions\_per\_sec: 1M

    

  application:

    device: F5 BIG-IP LTM

    throughput: 320 Gbps

    ssl\_tps: 1M

    

  gpu\_workload:

    device: NVIDIA GPU Load Balancer

    method: GPU-aware scheduling

    latency: \<100μs

    

  mining\_pool:

    device: Custom FPGA balancer

    hashrate\_distribution: Dynamic

    failover: \<100ms

### 6.10 Backup & Failover Hardware

**Redundancy Systems**

| Component | Primary | Backup | Failover Time |
| :---- | :---- | :---- | :---- |
| Power Path | Active path | Hot standby | \<4ms |
| Network Path | ECMP active | ECMP active | 0ms |
| Compute Nodes | N+2 per cluster | Cross-cluster | \<1 second |
| Storage | 3-way replication | Async backup | RPO: 1 minute |
| Controllers | Triple redundant | Voting system | \<100ms |

---

## 7\. Cooling Infrastructure

### 7.1 Cooling Strategy by Zone

| Zone | Method | Temperature | Efficiency |
| :---- | :---- | :---- | :---- |
| GPU Halls | Direct-to-chip liquid | 25°C supply, 35°C return | 95% heat capture |
| ASIC Halls | Immersion cooling | 35°C fluid temp | 98% heat capture |
| Network | Rear-door heat exchanger | 22°C supply | Standard |
| Storage | In-row cooling | 18-25°C | Standard |

### 7.2 Liquid Cooling System

**Primary Loop**: Direct-to-chip for GPUs

cooling\_specs:

  coolant\_type: Single-phase dielectric

  flow\_rate: 2000 GPM per hall

  pressure: 45 PSI

  temperature:

    supply: 25°C

    return: 35-45°C

    delta\_t: 10-20°C

  heat\_exchangers:

    type: Plate and frame

    capacity: 50MW per unit

    redundancy: N+1

  distribution:

    primary\_loop: Facility water

    secondary\_loop: CDU to servers

    tertiary\_loop: Cold plates

### 7.3 Immersion Cooling (ASICs)

**Tank Specifications**:

| Parameter | Specification | Notes |
| :---- | :---- | :---- |
| Tank Size | 4m x 2m x 1.5m | 40 ASICs per tank |
| Fluid Type | Synthetic dielectric | Non-conductive |
| Operating Temp | 35-45°C | Optimal for heat recovery |
| Flow Rate | 100 LPM per tank | Continuous circulation |
| Filtration | 10-micron | Particle removal |
| Heat Output | 150kW per tank | To heat recovery |

### 7.4 Heat Recovery System

**District Heating Integration**:

heat\_recovery:

  capture\_rate: 85% of IT load

  temperature\_lift:

    input: 35-45°C (from IT)

    output: 70-85°C (to district)

  heat\_pumps:

    type: Industrial scale

    cop: 4.5

    capacity: 50MW thermal per unit

  distribution:

    primary: District heating network

    secondary: On-site facilities

    tertiary: Agricultural/industrial

  annual\_recovery: 1,400,000 MWh thermal

---

## 8\. Network Infrastructure

### 8.1 Network Architecture

**Hierarchical Design**:

Internet (Multiple 100G carriers)

          │

     Border Routers

          │

     Core Switches (Spine)

     ╱    │    │    ╲

   Leaf  Leaf  Leaf  Leaf

    │     │     │     │

  GPUs  GPUs  ASICs ASICs

### 8.2 Network Specifications

| Layer | Equipment | Bandwidth | Redundancy |
| :---- | :---- | :---- | :---- |
| Internet | Multiple carriers | 8x 100Gbps | N+2 |
| Core | Arista 7500R | 12.8 Tbps | 2N |
| Spine | Arista 7280R | 6.4 Tbps | N+1 |
| Leaf | Arista 7050X | 3.2 Tbps | N+1 |
| GPU Fabric | InfiniBand | 200Gbps per GPU | Non-blocking |
| ASIC Network | Ethernet | 10Gbps per rack | 2:1 oversubscribed |

### 8.3 GPU Interconnect (InfiniBand)

**NVIDIA Quantum-2 InfiniBand**:

| Component | Specification | Scale |
| :---- | :---- | :---- |
| Switch | QM8700 400Gbps | 40-port |
| Adapters | ConnectX-7 | 400Gbps per GPU |
| Topology | Fat-tree | Non-blocking |
| Latency | \<0.5μs | Port-to-port |
| RDMA | RoCEv2 | GPU-Direct support |

### 8.4 Storage Network

**High-Performance Storage**:

| Tier | Type | Capacity | Performance |
| :---- | :---- | :---- | :---- |
| Hot | NVMe over Fabric | 5PB | 1M IOPS |
| Warm | SSD | 50PB | 100K IOPS |
| Cold | HDD | 500PB | Archive |
| Backup | Tape/Cloud | Unlimited | Disaster recovery |

---

## 9\. Security & Physical Infrastructure

### 9.1 Physical Security

| Layer | Measures | Standard |
| :---- | :---- | :---- |
| Perimeter | Fencing, cameras, sensors | ISO 27001 |
| Building | Card access, mantrap | SOC 2 |
| Data Hall | Biometric, 2-factor | PCI DSS |
| Rack | Electronic locks, sensors | Customer specific |
| Environmental | 24/7 monitoring | Industry standard |

### 9.2 Fire Suppression

| Zone | System | Agent |
| :---- | :---- | :---- |
| GPU/ASIC Halls | Pre-action sprinkler | Water |
| Electrical | Clean agent | Novec 1230 |
| Office | Standard sprinkler | Water |
| Critical Areas | VESDA | Early warning |

### 9.3 Environmental Monitoring

monitoring\_points:

  temperature:

    sensors\_per\_rack: 3 (top, middle, bottom)

    accuracy: ±0.5°C

  humidity:

    sensors\_per\_zone: 10

    range: 20-80% RH

  airflow:

    measurement: CFM per rack

    alerts: Deviation \>20%

  water\_detection:

    locations: Under raised floor, near CDUs

    response\_time: \<1 second

  power\_quality:

    monitoring: Voltage, frequency, harmonics

    sampling: 1kHz

---

## 10\. Modular Expansion Design

### 10.1 Standardized Modules

**GPU Module**: 10MW building block

| Component | Specification | Quantity |
| :---- | :---- | :---- |
| Racks | 52U, 750mm x 1200mm | 100 |
| Servers | 8-GPU nodes | 125 |
| GPUs | H100 80GB | 1,000 |
| Cooling | 10MW CDU capacity | 2 |
| Network | Leaf switches | 4 |
| Power | 10MW distribution | 1 |

**ASIC Module**: 10MW container farm

| Component | Specification | Quantity |
| :---- | :---- | :---- |
| Containers | 40ft ISO | 13 |
| ASICs | Latest generation | 2,600 |
| Power | Container PDUs | 13 |
| Cooling | Immersion tanks | 65 |
| Network | Aggregation switches | 2 |

### 10.2 Rapid Deployment Timeline

| Phase | Scope | Timeline |
| :---- | :---- | :---- |
| Site Prep | Power, concrete, utilities | 3 months |
| Module Delivery | Pre-fab units | 2 months |
| Installation | Modules, connections | 1 month |
| Testing | Commissioning, burn-in | 2 weeks |
| **Total** | **10MW module** | **\<6 months** |

---

## 11\. Vendor Specifications

### 11.1 Critical Vendors

| Category | Primary Vendor | Backup Vendor | Lead Time |
| :---- | :---- | :---- | :---- |
| GPUs | NVIDIA | AMD | 3-6 months |
| ASICs | Bitmain | MicroBT | 2-4 months |
| Servers | Supermicro | Dell | 2-3 months |
| Network | Arista | Cisco | 6-8 weeks |
| Cooling | Vertiv | Schneider | 3-4 months |
| Power | ABB | Siemens | 4-6 months |

### 11.2 Service Level Agreements

| Component | Response Time | Resolution Time | Spares |
| :---- | :---- | :---- | :---- |
| GPUs | 4 hours | 24 hours | 2% on-site |
| ASICs | 24 hours | 72 hours | 5% on-site |
| Network | 2 hours | 4 hours | N+1 on-site |
| Cooling | 1 hour | 4 hours | Critical parts |
| Power | 30 minutes | 2 hours | All critical |

---

## 12\. Performance Metrics

### 12.1 Efficiency Targets

| Metric | Target | Measurement |
| :---- | :---- | :---- |
| PUE | \<1.20 | Monthly average |
| WUE | \<0.5 L/kWh | Annual average |
| Heat Recovery | \>85% | Of IT load |
| Renewable Energy | \>70% | Annual average |
| Carbon Intensity | \<0.2 kg CO2/kWh | Annual average |

### 12.2 Reliability Targets

| System | Availability | Max Downtime/Year |
| :---- | :---- | :---- |
| Power | 99.995% | 26 minutes |
| Cooling | 99.99% | 52 minutes |
| Network | 99.999% | 5 minutes |
| Overall Facility | 99.99% | 52 minutes |

---

## 13\. Maintenance Requirements

### 13.1 Preventive Maintenance Schedule

| System | Frequency | Duration | Impact |
| :---- | :---- | :---- | :---- |
| UPS | Quarterly | 4 hours | None (N+1) |
| Generators | Monthly | 2 hours | None |
| Cooling | Bi-weekly | 2 hours | None (N+1) |
| PDUs | Annual | 8 hours | Planned migration |
| Fire Systems | Quarterly | 4 hours | None |

### 13.2 Spare Parts Inventory

| Category | On-Site Stock | Lead Time |
| :---- | :---- | :---- |
| GPUs | 2% of fleet | 3 months |
| ASICs | 5% of fleet | 2 months |
| Power Supplies | 10% of installed | 2 weeks |
| Fans | 20% of installed | 1 week |
| Network Optics | 5% of ports | 1 week |
| Cooling Pumps | 2 per system | 4 weeks |

---

## 14\. Compliance & Certifications

### 14.1 Required Certifications

| Certification | Scope | Timeline |
| :---- | :---- | :---- |
| ISO 27001 | Information Security | Q2 2025 |
| SOC 2 Type II | Security & Availability | Q3 2025 |
| ISO 50001 | Energy Management | Q4 2025 |
| TIER III | Uptime Institute | Q4 2025 |
| PCI DSS | Payment Processing | As needed |

### 14.2 Environmental Compliance

| Regulation | Requirement | Status |
| :---- | :---- | :---- |
| EPA | Emissions standards | Design phase |
| Local Noise | \<50 dB at perimeter | Compliant |
| Water Use | Permits for cooling | In process |
| Waste Heat | District heating permits | Approved |

---

## 15\. Risk Analysis

### 15.1 Hardware Risks

| Risk | Impact | Probability | Mitigation |
| :---- | :---- | :---- | :---- |
| GPU shortage | Critical | Medium | Multiple vendors, advance orders |
| ASIC obsolescence | High | High | Regular refresh cycle |
| Cooling failure | Critical | Low | N+1 redundancy, monitoring |
| Power outage | Critical | Low | Multiple feeds, generators |
| Equipment failure | Medium | Medium | Spare inventory, SLAs |

### 15.2 Environmental Risks

| Risk | Impact | Mitigation |
| :---- | :---- | :---- |
| Extreme heat | High | Additional cooling capacity |
| Flooding | Critical | Elevated equipment, drainage |
| Earthquakes | Medium | Seismic bracing |
| Storms | High | Hardened structure |

