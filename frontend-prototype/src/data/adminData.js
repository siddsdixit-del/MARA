// ADMIN SYNTHETIC DATA - Platform-wide view across ALL customers

// Multiple customers on the platform
export const customers = [
  { id: 'cust-001', name: 'Acme Corporation', tier: 'Enterprise', monthlyBudget: 25000, spent: 18750 },
  { id: 'cust-002', name: 'TechCo Inc', tier: 'Enterprise', monthlyBudget: 45000, spent: 42100 },
  { id: 'cust-003', name: 'DataCorp LLC', tier: 'Professional', monthlyBudget: 15000, spent: 9800 },
  { id: 'cust-004', name: 'AI Research Labs', tier: 'Enterprise', monthlyBudget: 60000, spent: 58200 },
  { id: 'cust-005', name: 'CloudML Systems', tier: 'Professional', monthlyBudget: 20000, spent: 14500 },
  { id: 'cust-006', name: 'Neural Networks Co', tier: 'Startup', monthlyBudget: 8000, spent: 6200 },
  { id: 'cust-007', name: 'DeepTech Solutions', tier: 'Enterprise', monthlyBudget: 35000, spent: 31800 },
  { id: 'cust-008', name: 'Quantum AI', tier: 'Professional', monthlyBudget: 18000, spent: 15400 },
];

// Platform-wide KPIs
export const platformKPIs = {
  totalRevenue: 196750, // Sum of all customer spending
  totalCustomers: customers.length,
  activeWorkloads: 142,
  totalGPUs: 10248,
  gpuUtilization: 94.2,
  activeFacilities: 3,
  btcMiningRevenue: 45600,
  aiInferenceRevenue: 151150,
  totalPowerConsumption: 12.4, // MW
  carbonOffset: 8960, // tons CO2
};

// All facilities
export const facilities = [
  { id: 'fac-tx1', name: 'Texas-1', location: 'Dallas, TX', gpus: 4096, asics: 2048, power: 5.2, status: 'optimal' },
  { id: 'fac-tx2', name: 'Texas-2', location: 'Austin, TX', gpus: 4096, asics: 2048, power: 4.8, status: 'optimal' },
  { id: 'fac-ca1', name: 'Canada-1', location: 'Quebec City, QC', gpus: 2056, asics: 1024, power: 2.4, status: 'warning' },
];

// ALL workloads across ALL customers
export const allWorkloads = [
  // Acme Corporation workloads
  { id: 'wl-abc123', customer: 'Acme Corporation', customerId: 'cust-001', type: 'AI Inference RT', status: 'Running', resources: '8x H100', facility: 'Texas-1', priority: 'High', runtime: '2h 34m', cost: 342.50, gpuUtil: 94, submittedAt: '2025-10-23T08:15:00Z' },
  { id: 'wl-abc124', customer: 'Acme Corporation', customerId: 'cust-001', type: 'Model Training', status: 'Running', resources: '16x H100', facility: 'Texas-2', priority: 'High', runtime: '12h 45m', cost: 2856.00, gpuUtil: 98, submittedAt: '2025-10-22T18:00:00Z' },
  { id: 'wl-abc125', customer: 'Acme Corporation', customerId: 'cust-001', type: 'AI Inference Batch', status: 'Completed', resources: '4x H100', facility: 'Texas-1', priority: 'Medium', runtime: '8h 00m', cost: 680.00, gpuUtil: 89, submittedAt: '2025-10-22T10:30:00Z' },
  { id: 'wl-abc126', customer: 'Acme Corporation', customerId: 'cust-001', type: 'Data Processing', status: 'Running', resources: '2x L40S', facility: 'Canada-1', priority: 'Low', runtime: '1h 20m', cost: 95.00, gpuUtil: 76, submittedAt: '2025-10-23T12:00:00Z' },
  
  // TechCo Inc workloads
  { id: 'wl-tch001', customer: 'TechCo Inc', customerId: 'cust-002', type: 'Model Training', status: 'Running', resources: '32x H100', facility: 'Texas-1', priority: 'Critical', runtime: '48h 12m', cost: 11520.00, gpuUtil: 99, submittedAt: '2025-10-21T06:00:00Z' },
  { id: 'wl-tch002', customer: 'TechCo Inc', customerId: 'cust-002', type: 'AI Inference RT', status: 'Running', resources: '16x H100', facility: 'Texas-2', priority: 'High', runtime: '6h 22m', cost: 1890.00, gpuUtil: 96, submittedAt: '2025-10-23T04:00:00Z' },
  { id: 'wl-tch003', customer: 'TechCo Inc', customerId: 'cust-002', type: 'Hyperparameter Tuning', status: 'Running', resources: '24x H100', facility: 'Texas-1', priority: 'High', runtime: '18h 50m', cost: 5640.00, gpuUtil: 92, submittedAt: '2025-10-22T12:00:00Z' },
  { id: 'wl-tch004', customer: 'TechCo Inc', customerId: 'cust-002', type: 'AI Inference Batch', status: 'Queued', resources: 'Pending', facility: null, priority: 'Medium', runtime: '--', cost: 0, gpuUtil: 0, submittedAt: '2025-10-23T13:45:00Z' },
  
  // DataCorp LLC workloads
  { id: 'wl-dat001', customer: 'DataCorp LLC', customerId: 'cust-003', type: 'Data Processing', status: 'Running', resources: '8x L40S', facility: 'Canada-1', priority: 'Medium', runtime: '4h 15m', cost: 845.00, gpuUtil: 82, submittedAt: '2025-10-23T09:00:00Z' },
  { id: 'wl-dat002', customer: 'DataCorp LLC', customerId: 'cust-003', type: 'AI Inference Batch', status: 'Running', resources: '4x H100', facility: 'Texas-2', priority: 'Medium', runtime: '2h 10m', cost: 340.00, gpuUtil: 88, submittedAt: '2025-10-23T11:30:00Z' },
  { id: 'wl-dat003', customer: 'DataCorp LLC', customerId: 'cust-003', type: 'Model Training', status: 'Completed', resources: '8x H100', facility: 'Texas-1', priority: 'High', runtime: '24h 00m', cost: 4800.00, gpuUtil: 95, submittedAt: '2025-10-21T08:00:00Z' },
  
  // AI Research Labs workloads
  { id: 'wl-air001', customer: 'AI Research Labs', customerId: 'cust-004', type: 'Model Training', status: 'Running', resources: '64x H100', facility: 'Texas-1', priority: 'Critical', runtime: '96h 30m', cost: 23040.00, gpuUtil: 99, submittedAt: '2025-10-19T10:00:00Z' },
  { id: 'wl-air002', customer: 'AI Research Labs', customerId: 'cust-004', type: 'Model Training', status: 'Running', resources: '32x H100', facility: 'Texas-2', priority: 'High', runtime: '72h 15m', cost: 11520.00, gpuUtil: 98, submittedAt: '2025-10-20T14:00:00Z' },
  { id: 'wl-air003', customer: 'AI Research Labs', customerId: 'cust-004', type: 'Hyperparameter Tuning', status: 'Running', resources: '16x H100', facility: 'Texas-1', priority: 'High', runtime: '36h 40m', cost: 5280.00, gpuUtil: 93, submittedAt: '2025-10-22T02:00:00Z' },
  { id: 'wl-air004', customer: 'AI Research Labs', customerId: 'cust-004', type: 'AI Inference RT', status: 'Running', resources: '24x H100', facility: 'Texas-2', priority: 'High', runtime: '12h 05m', cost: 3600.00, gpuUtil: 97, submittedAt: '2025-10-23T01:00:00Z' },
  { id: 'wl-air005', customer: 'AI Research Labs', customerId: 'cust-004', type: 'Model Evaluation', status: 'Running', resources: '8x H100', facility: 'Canada-1', priority: 'Medium', runtime: '4h 20m', cost: 720.00, gpuUtil: 86, submittedAt: '2025-10-23T09:30:00Z' },
  
  // CloudML Systems workloads
  { id: 'wl-cml001', customer: 'CloudML Systems', customerId: 'cust-005', type: 'AI Inference RT', status: 'Running', resources: '12x H100', facility: 'Texas-2', priority: 'High', runtime: '8h 50m', cost: 1680.00, gpuUtil: 95, submittedAt: '2025-10-23T04:30:00Z' },
  { id: 'wl-cml002', customer: 'CloudML Systems', customerId: 'cust-005', type: 'Model Training', status: 'Running', resources: '16x H100', facility: 'Texas-1', priority: 'High', runtime: '24h 30m', cost: 4800.00, gpuUtil: 96, submittedAt: '2025-10-22T09:00:00Z' },
  { id: 'wl-cml003', customer: 'CloudML Systems', customerId: 'cust-005', type: 'Data Processing', status: 'Queued', resources: 'Pending', facility: null, priority: 'Low', runtime: '--', cost: 0, gpuUtil: 0, submittedAt: '2025-10-23T13:00:00Z' },
  
  // Neural Networks Co workloads
  { id: 'wl-nnc001', customer: 'Neural Networks Co', customerId: 'cust-006', type: 'Model Training', status: 'Running', resources: '8x L40S', facility: 'Canada-1', priority: 'Medium', runtime: '16h 10m', cost: 2560.00, gpuUtil: 90, submittedAt: '2025-10-22T20:00:00Z' },
  { id: 'wl-nnc002', customer: 'Neural Networks Co', customerId: 'cust-006', type: 'AI Inference Batch', status: 'Running', resources: '4x L40S', facility: 'Canada-1', priority: 'Low', runtime: '3h 25m', cost: 420.00, gpuUtil: 78, submittedAt: '2025-10-23T10:00:00Z' },
  { id: 'wl-nnc003', customer: 'Neural Networks Co', customerId: 'cust-006', type: 'Model Evaluation', status: 'Completed', resources: '2x L40S', facility: 'Canada-1', priority: 'Low', runtime: '6h 00m', cost: 480.00, gpuUtil: 72, submittedAt: '2025-10-22T08:00:00Z' },
  
  // DeepTech Solutions workloads
  { id: 'wl-dts001', customer: 'DeepTech Solutions', customerId: 'cust-007', type: 'AI Inference RT', status: 'Running', resources: '20x H100', facility: 'Texas-1', priority: 'High', runtime: '10h 40m', cost: 3200.00, gpuUtil: 97, submittedAt: '2025-10-23T02:00:00Z' },
  { id: 'wl-dts002', customer: 'DeepTech Solutions', customerId: 'cust-007', type: 'Model Training', status: 'Running', resources: '24x H100', facility: 'Texas-2', priority: 'High', runtime: '48h 20m', cost: 9600.00, gpuUtil: 98, submittedAt: '2025-10-21T12:00:00Z' },
  { id: 'wl-dts003', customer: 'DeepTech Solutions', customerId: 'cust-007', type: 'Hyperparameter Tuning', status: 'Running', resources: '12x H100', facility: 'Texas-1', priority: 'Medium', runtime: '18h 15m', cost: 2880.00, gpuUtil: 91, submittedAt: '2025-10-22T18:00:00Z' },
  { id: 'wl-dts004', customer: 'DeepTech Solutions', customerId: 'cust-007', type: 'AI Inference Batch', status: 'Queued', resources: 'Pending', facility: null, priority: 'Low', runtime: '--', cost: 0, gpuUtil: 0, submittedAt: '2025-10-23T14:00:00Z' },
  
  // Quantum AI workloads
  { id: 'wl-qai001', customer: 'Quantum AI', customerId: 'cust-008', type: 'Model Training', status: 'Running', resources: '16x H100', facility: 'Texas-2', priority: 'High', runtime: '32h 50m', cost: 6400.00, gpuUtil: 97, submittedAt: '2025-10-22T04:00:00Z' },
  { id: 'wl-qai002', customer: 'Quantum AI', customerId: 'cust-008', type: 'AI Inference RT', status: 'Running', resources: '8x H100', facility: 'Texas-1', priority: 'High', runtime: '6h 30m', cost: 1200.00, gpuUtil: 94, submittedAt: '2025-10-23T06:00:00Z' },
  { id: 'wl-qai003', customer: 'Quantum AI', customerId: 'cust-008', type: 'Data Processing', status: 'Running', resources: '4x L40S', facility: 'Canada-1', priority: 'Medium', runtime: '2h 40m', cost: 320.00, gpuUtil: 80, submittedAt: '2025-10-23T11:00:00Z' },
];

// Platform-wide billing data
export const platformBilling = {
  currentMonth: {
    total: 196750,
    byCustomer: [
      { customer: 'AI Research Labs', amount: 58200, budget: 60000, utilization: 97 },
      { customer: 'TechCo Inc', amount: 42100, budget: 45000, utilization: 93.5 },
      { customer: 'DeepTech Solutions', amount: 31800, budget: 35000, utilization: 90.8 },
      { customer: 'Acme Corporation', amount: 18750, budget: 25000, utilization: 75 },
      { customer: 'Quantum AI', amount: 15400, budget: 18000, utilization: 85.5 },
      { customer: 'CloudML Systems', amount: 14500, budget: 20000, utilization: 72.5 },
      { customer: 'DataCorp LLC', amount: 9800, budget: 15000, utilization: 65.3 },
      { customer: 'Neural Networks Co', amount: 6200, budget: 8000, utilization: 77.5 },
    ],
  },
  revenueByDay: [
    { date: '2025-10-17', btcMining: 1850, aiInference: 5420, total: 7270 },
    { date: '2025-10-18', btcMining: 1920, aiInference: 6180, total: 8100 },
    { date: '2025-10-19', btcMining: 1780, aiInference: 6850, total: 8630 },
    { date: '2025-10-20', btcMining: 1650, aiInference: 7240, total: 8890 },
    { date: '2025-10-21', btcMining: 1580, aiInference: 7890, total: 9470 },
    { date: '2025-10-22', btcMining: 1520, aiInference: 8420, total: 9940 },
    { date: '2025-10-23', btcMining: 1450, aiInference: 8940, total: 10390 },
  ],
};

// Platform-wide alerts
export const platformAlerts = [
  { id: 'alert-001', severity: 'critical', title: 'High Temperature Detected', message: 'GPU cluster in Texas-1 Rack 12 exceeding 85°C', facility: 'Texas-1', timestamp: '2025-10-23T13:45:00Z', acknowledged: false },
  { id: 'alert-002', severity: 'critical', title: 'Power Surge Detected', message: 'Voltage spike detected in Canada-1 PDU-03', facility: 'Canada-1', timestamp: '2025-10-23T12:20:00Z', acknowledged: false },
  { id: 'alert-003', severity: 'warning', title: 'GPU Utilization Below Threshold', message: 'Rack 8 in Texas-2 running at 62% utilization', facility: 'Texas-2', timestamp: '2025-10-23T11:30:00Z', acknowledged: true },
  { id: 'alert-004', severity: 'warning', title: 'Customer Budget Warning', message: 'AI Research Labs at 97% of monthly budget', customer: 'AI Research Labs', timestamp: '2025-10-23T10:00:00Z', acknowledged: false },
  { id: 'alert-005', severity: 'warning', title: 'Network Latency Spike', message: 'Inter-facility latency increased to 45ms (Texas-1 ↔ Canada-1)', timestamp: '2025-10-23T09:15:00Z', acknowledged: true },
  { id: 'alert-006', severity: 'info', title: 'Scheduled Maintenance', message: 'Cooling system maintenance scheduled for Canada-1 on 2025-10-25', facility: 'Canada-1', timestamp: '2025-10-23T08:00:00Z', acknowledged: true },
  { id: 'alert-007', severity: 'info', title: 'New Customer Onboarded', message: 'Quantum AI successfully onboarded with 18k monthly budget', timestamp: '2025-10-22T16:00:00Z', acknowledged: true },
  { id: 'alert-008', severity: 'critical', title: 'ASIC Failure', message: 'Mining ASIC-2048 in Texas-2 has failed and is offline', facility: 'Texas-2', timestamp: '2025-10-23T14:10:00Z', acknowledged: false },
  { id: 'alert-009', severity: 'warning', title: 'High Queue Depth', message: '12 workloads queued awaiting GPU availability', timestamp: '2025-10-23T13:00:00Z', acknowledged: false },
  { id: 'alert-010', severity: 'info', title: 'Bitcoin Price Alert', message: 'BTC price crossed $72,000 - mining profitability increased', timestamp: '2025-10-23T07:30:00Z', acknowledged: true },
  { id: 'alert-011', severity: 'warning', title: 'Customer Over Budget', message: 'TechCo Inc has exceeded 93% of monthly budget', customer: 'TechCo Inc', timestamp: '2025-10-23T06:45:00Z', acknowledged: true },
  { id: 'alert-012', severity: 'info', title: 'Capacity Expansion Complete', message: '128 new H100 GPUs installed in Texas-1', facility: 'Texas-1', timestamp: '2025-10-22T14:00:00Z', acknowledged: true },
];

// Platform utilization over time
export const platformUtilization = [
  { time: '00:00', gpuUtil: 92.5, power: 11.8, revenue: 420 },
  { time: '04:00', gpuUtil: 94.2, power: 12.1, revenue: 450 },
  { time: '08:00', gpuUtil: 96.8, power: 12.5, revenue: 485 },
  { time: '12:00', gpuUtil: 95.1, power: 12.3, revenue: 468 },
  { time: '16:00', gpuUtil: 93.7, power: 12.0, revenue: 442 },
  { time: '20:00', gpuUtil: 91.4, power: 11.7, revenue: 428 },
];

// Resource inventory (all GPUs/ASICs)
export const allResources = [
  // Texas-1 GPUs
  { id: 'GPU-TX1-001', type: 'GPU', model: 'H100 80GB', facility: 'Texas-1', rack: 'R01', status: 'active', utilization: 98, temperature: 76, power: 700, assignedTo: 'TechCo Inc', workload: 'wl-tch001' },
  { id: 'GPU-TX1-002', type: 'GPU', model: 'H100 80GB', facility: 'Texas-1', rack: 'R01', status: 'active', utilization: 97, temperature: 74, power: 695, assignedTo: 'AI Research Labs', workload: 'wl-air001' },
  { id: 'GPU-TX1-003', type: 'GPU', model: 'H100 80GB', facility: 'Texas-1', rack: 'R01', status: 'active', utilization: 96, temperature: 73, power: 690, assignedTo: 'DeepTech Solutions', workload: 'wl-dts001' },
  { id: 'GPU-TX1-004', type: 'GPU', model: 'H100 80GB', facility: 'Texas-1', rack: 'R01', status: 'active', utilization: 95, temperature: 75, power: 688, assignedTo: 'Acme Corporation', workload: 'wl-abc123' },
  { id: 'GPU-TX1-005', type: 'GPU', model: 'H100 80GB', facility: 'Texas-1', rack: 'R02', status: 'idle', utilization: 0, temperature: 45, power: 50, assignedTo: null, workload: null },
  { id: 'GPU-TX1-006', type: 'GPU', model: 'L40S 48GB', facility: 'Texas-1', rack: 'R02', status: 'active', utilization: 88, temperature: 68, power: 350, assignedTo: 'CloudML Systems', workload: 'wl-cml001' },
  
  // Texas-2 GPUs
  { id: 'GPU-TX2-001', type: 'GPU', model: 'H100 80GB', facility: 'Texas-2', rack: 'R01', status: 'active', utilization: 99, temperature: 78, power: 705, assignedTo: 'AI Research Labs', workload: 'wl-air002' },
  { id: 'GPU-TX2-002', type: 'GPU', model: 'H100 80GB', facility: 'Texas-2', rack: 'R01', status: 'active', utilization: 98, temperature: 77, power: 702, assignedTo: 'DeepTech Solutions', workload: 'wl-dts002' },
  { id: 'GPU-TX2-003', type: 'GPU', model: 'H100 80GB', facility: 'Texas-2', rack: 'R02', status: 'active', utilization: 96, temperature: 74, power: 695, assignedTo: 'Quantum AI', workload: 'wl-qai001' },
  { id: 'GPU-TX2-004', type: 'GPU', model: 'H100 80GB', facility: 'Texas-2', rack: 'R02', status: 'active', utilization: 94, temperature: 72, power: 685, assignedTo: 'Acme Corporation', workload: 'wl-abc124' },
  { id: 'GPU-TX2-005', type: 'GPU', model: 'L40S 48GB', facility: 'Texas-2', rack: 'R03', status: 'maintenance', utilization: 0, temperature: 42, power: 0, assignedTo: null, workload: null },
  
  // Canada-1 GPUs
  { id: 'GPU-CA1-001', type: 'GPU', model: 'H100 80GB', facility: 'Canada-1', rack: 'R01', status: 'active', utilization: 86, temperature: 70, power: 680, assignedTo: 'AI Research Labs', workload: 'wl-air005' },
  { id: 'GPU-CA1-002', type: 'GPU', model: 'L40S 48GB', facility: 'Canada-1', rack: 'R01', status: 'active', utilization: 82, temperature: 66, power: 345, assignedTo: 'DataCorp LLC', workload: 'wl-dat001' },
  { id: 'GPU-CA1-003', type: 'GPU', model: 'L40S 48GB', facility: 'Canada-1', rack: 'R02', status: 'active', utilization: 90, temperature: 71, power: 355, assignedTo: 'Neural Networks Co', workload: 'wl-nnc001' },
  { id: 'GPU-CA1-004', type: 'GPU', model: 'L40S 48GB', facility: 'Canada-1', rack: 'R02', status: 'active', utilization: 76, temperature: 64, power: 330, assignedTo: 'Acme Corporation', workload: 'wl-abc126' },
  { id: 'GPU-CA1-005', type: 'GPU', model: 'A100 80GB', facility: 'Canada-1', rack: 'R03', status: 'idle', utilization: 0, temperature: 48, power: 55, assignedTo: null, workload: null },
  
  // ASICs for Bitcoin Mining
  { id: 'ASIC-TX1-001', type: 'ASIC', model: 'Antminer S19 XP', facility: 'Texas-1', rack: 'M01', status: 'active', hashrate: 140, power: 3010, temperature: 68, miningPool: 'Foundry USA' },
  { id: 'ASIC-TX2-001', type: 'ASIC', model: 'Antminer S19 XP', facility: 'Texas-2', rack: 'M01', status: 'active', hashrate: 140, power: 3010, temperature: 70, miningPool: 'Foundry USA' },
  { id: 'ASIC-TX2-002', type: 'ASIC', model: 'Antminer S19 XP', facility: 'Texas-2', rack: 'M01', status: 'failed', hashrate: 0, power: 0, temperature: 0, miningPool: null },
  { id: 'ASIC-CA1-001', type: 'ASIC', model: 'Whatsminer M50S', facility: 'Canada-1', rack: 'M01', status: 'active', hashrate: 126, power: 3276, temperature: 65, miningPool: 'Foundry USA' },
];

// Economic optimization data
export const economicMetrics = {
  btcPrice: 72450,
  electricityRate: 0.048, // $/kWh
  gpuSpotRate: { h100: 2.50, l40s: 1.20, a100: 1.80 }, // $/GPU/hour
  currentOptimalWorkload: 'AI Inference', // vs Bitcoin Mining
  switchingOpportunities: 3, // times today when it was more profitable to switch
  projectedDailyRevenue: 10390,
  profitMargin: 42.5,
};

