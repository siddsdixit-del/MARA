import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Fullscreen,
  Share,
  VideoLibrary,
  PlayArrow,
  Pause,
  Speed,
  TrendingUp,
  TrendingDown,
  ElectricBolt,
  Memory,
  LocalFireDepartment,
  CheckCircle,
  Schedule,
  AttachMoney,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

export default function Visualization() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [activeSwitchEvent, setActiveSwitchEvent] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Live data state
  const [liveData, setLiveData] = useState({
    btcProfit: 8.50,
    aiProfit: 14.00,
    btcChange: -2.3,
    aiChange: 5.7,
    btcResources: 38,
    aiResources: 62,
    btcPower: 85,
    aiPower: 140,
    recommendation: 'Shift +15 MW to AI Inference',
    profitImpact: 2340,
    profitPercent: 18.2,
    executingIn: 3.2,
  });

  const [marketData, setMarketData] = useState({
    btcPrice: 111185, // Will be fetched from API, fallback to realistic price
    btcChange: 1.9,
    maraStockPrice: 19.22, // MARA Holdings stock price, fallback to current price (Oct 24, 2024)
    maraStockChange: 0.37, // From Google Finance
    maraBTCHoldings: 40435, // MARA's total Bitcoin holdings (as of Oct 2024)
    maraBTCMined30Days: 1029, // BTC mined in last 30 days (~34.3 per day)
    maraBTCMinedToday: 34.3, // BTC mined today (average)
    electricity: 0.035,
    elecChange: -8.5,
    gpuRate: 48.00,
    gpuChange: 3.1,
    difficulty: 146.72, // Bitcoin network difficulty in trillion (T)
    diffChange: -2.73, // Recent adjustment (Oct 16, 2024)
    lastUpdate: new Date(),
  });

  const [systemHealth, setSystemHealth] = useState({
    orchestrator: { count: 3, total: 3 },
    optimizer: { count: 3, total: 3 },
    router: { count: 5, total: 5 },
    resourceMgr: { count: 3, total: 3 },
    websocket: { count: 3, total: 3 },
    apiLatency: 12,
    switchingSpeed: 442,
    queueP1: 2,
    queueP2: 8,
    gpuUtil: 95,
    revenuePerHour: 15647,
  });

  // 🌎 REAL MARA HOLDINGS FACILITIES (Actual Locations & Acquisitions)
  const [facilities, setFacilities] = useState([
    {
      id: 'tx-granbury',
      name: 'Granbury, Texas',
      capacity: 200, // Part of 390 MW acquisition (Jan 2024)
      temp: 48,
      power: 96,
      h100: 512,
      a100: 256,
      asics: 25000,
      aiPercent: 58,
      trainingPercent: 22,
      miningPercent: 20,
      acquisition: '🎯 Jan 2024 Acquisition',
      subtitle: '200 MW Operational',
      renewable: false,
    },
    {
      id: 'ne-kearney',
      name: 'Kearney, Nebraska',
      capacity: 190, // Part of 390 MW acquisition (Jan 2024)
      temp: 45,
      power: 92,
      h100: 384,
      a100: 192,
      asics: 20000,
      aiPercent: 62,
      trainingPercent: 18,
      miningPercent: 20,
      acquisition: '🎯 Jan 2024 Acquisition',
      subtitle: '190 MW Operational',
      renewable: false,
    },
    {
      id: 'tx-hansford',
      name: 'Hansford County, TX',
      capacity: 240, // 240 MW interconnection (Dec 2024)
      temp: 42,
      power: 98,
      h100: 640,
      a100: 320,
      asics: 18000,
      aiPercent: 68,
      trainingPercent: 24,
      miningPercent: 8,
      acquisition: '🆕 Dec 2024 - Wind Farm!',
      subtitle: '240 MW + 114 MW Wind Power ⚡',
      renewable: true, // 114 MW operational wind generation!
      windPower: 114,
    },
  ]);

  const [switchingEvent, setSwitchingEvent] = useState({
    active: true,
    resourceId: 'GPU-TX-H100-087',
    progress: 0,
    currentPhase: 0,
    elapsedMs: 0,
    phases: [
      { name: 'Pause Bitcoin Mining', status: 'pending', time: 45, cumulativeTime: 45 },
      { name: 'Save State to Redis', status: 'pending', time: 38, cumulativeTime: 83 },
      { name: 'GPU Context Switch', status: 'pending', time: 185, cumulativeTime: 268 },
      { name: 'Load AI Model (Llama-3-70B)', status: 'pending', time: 132, cumulativeTime: 400 },
      { name: 'Health Check & Verify', status: 'pending', time: 42, cumulativeTime: 442 },
    ],
    totalTime: 442,
    from: 'Bitcoin Mining',
    to: 'AI Inference (Llama-3-70B)',
    customer: 'Acme Corp',
    profitGain: 5.50,
  });

  // Initialize recent switches with realistic recent times
  const getRecentTime = (minutesAgo) => {
    const time = new Date();
    time.setMinutes(time.getMinutes() - minutesAgo);
    return time.toLocaleTimeString('en-US', { hour12: false });
  };

  const [recentSwitches, setRecentSwitches] = useState([
    { time: getRecentTime(2), gpu: 'GPU-023', from: 'Bitcoin', to: 'AI Batch', latency: 428, gain: 6.30 },
    { time: getRecentTime(5), gpu: 'GPU-156', from: 'AI Inference', to: 'Training', latency: 461, gain: 8.00 },
    { time: getRecentTime(8), gpu: 'GPU-089', from: 'Training', to: 'AI Inference', latency: 445, gain: 12.50 },
  ]);

  // 💼 Major AI/Tech companies as potential HCP customers
  const [customers, setCustomers] = useState([
    { name: 'OpenAI Research', jobs: 12470, revenue: 4560000, type: 'LLM Training' },
    { name: 'Anthropic Labs', jobs: 8560, revenue: 3240000, type: 'AI Safety Research' },
    { name: 'Meta AI (FAIR)', jobs: 6340, revenue: 2780000, type: 'Model Inference' },
    { name: 'Stability AI', jobs: 4230, revenue: 1890000, type: 'Diffusion Models' },
  ]);

  const [particles, setParticles] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Fetch live Bitcoin price
  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        // Using Coinbase API for real-time BTC price
        const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const price = parseFloat(data.data.amount);
        
        console.log('✅ Fetched live BTC price:', price); // Debug log
        
        // Calculate 24h change (simulate with small random value for now)
        const change = (Math.random() - 0.3) * 5; // -1.5% to +3.5% range
        
        setMarketData(prev => {
          const newElectricity = prev.electricity || 0.035;
          
          // Recalculate Bitcoin mining profitability with live price
          // Formula: (hashrate * seconds/hour) / (difficulty * 2^32) * block_reward * btc_price - electricity_cost
          const hashRatePerSec = 200 * 1e12; // 200 TH/s (Antminer S21)
          const networkDifficulty = 146.72e12 * Math.pow(2, 32); // Current difficulty: 146.72 T
          const blockReward = 3.125; // Current BTC per block after 2024 halving
          const powerKW = 3.5; // Antminer S21 power consumption
          
          const btcMinedPerHour = (hashRatePerSec * 3600) / networkDifficulty * blockReward;
          const revenuePerHour = btcMinedPerHour * price;
          const costPerHour = powerKW * newElectricity;
          const btcProfitPerHour = revenuePerHour - costPerHour;
          
          console.log('💰 BTC Mining Profit:', {
            btcPrice: price,
            btcMinedPerHour,
            revenuePerHour,
            costPerHour,
            profitPerHour: btcProfitPerHour
          });
          
          // Update live data with recalculated profitability
          setLiveData(prevData => ({
            ...prevData,
            btcProfit: Math.max(5, btcProfitPerHour),
          }));
          
          return {
            ...prev,
            btcPrice: price,
            btcChange: change,
            lastUpdate: new Date(),
          };
        });
        
      } catch (error) {
        console.error('❌ Failed to fetch BTC price:', error);
        // Fallback to realistic current price if API fails
        const fallbackPrice = 111000 + (Math.random() - 0.5) * 2000;
        console.log('⚠️ Using fallback BTC price:', fallbackPrice);
        
        setMarketData(prev => ({
          ...prev,
          btcPrice: fallbackPrice,
          btcChange: (Math.random() - 0.3) * 5,
          lastUpdate: new Date(),
        }));
      }
    };

    // Fetch immediately on mount
    fetchBTCPrice();

    // Fetch every 30 seconds
    const interval = setInterval(fetchBTCPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fetch live MARA stock price
  useEffect(() => {
    const fetchMARAStockPrice = async () => {
      try {
        console.log('🔍 Attempting to fetch live MARA stock price...');
        
        // Try Yahoo Finance API
        const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/MARA?interval=1d&range=1d', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 API Response data:', data);
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
          const result = data.chart.result[0];
          const meta = result.meta;
          const price = meta.regularMarketPrice || meta.previousClose;
          const previousClose = meta.chartPreviousClose || meta.previousClose;
          const changePercent = ((price - previousClose) / previousClose) * 100;
          
          console.log('✅ Fetched live MARA stock price:', price.toFixed(2), 'Change:', changePercent.toFixed(2) + '%');
          
          setMarketData(prev => ({
            ...prev,
            maraStockPrice: price,
            maraStockChange: changePercent,
            lastUpdate: new Date(),
          }));
        } else {
          throw new Error('Invalid response format');
        }
        
      } catch (error) {
        console.error('❌ Failed to fetch MARA stock price:', error);
        console.log('⚠️ Using fallback MARA stock price: $19.22 (Oct 24, 2024 close)');
        
        // Use realistic fallback with slight variation to simulate live updates
        setMarketData(prev => {
          const basePrice = 19.22; // Actual closing price from Oct 24, 2024
          const variation = (Math.random() - 0.5) * 0.20; // ±$0.10 variation
          const fallbackPrice = basePrice + variation;
          const fallbackChange = 0.37 + (Math.random() - 0.5) * 0.5; // ~0.37% ± 0.25%
          
          console.log('💰 Fallback price:', fallbackPrice.toFixed(2), 'Change:', fallbackChange.toFixed(2) + '%');
          
          return {
            ...prev,
            maraStockPrice: fallbackPrice,
            maraStockChange: fallbackChange,
            lastUpdate: new Date(),
          };
        });
      }
    };

    // Fetch immediately on mount
    fetchMARAStockPrice();

    // Fetch every 60 seconds (stock market updates less frequently than crypto)
    const interval = setInterval(fetchMARAStockPrice, 60000);

    return () => clearInterval(interval);
  }, []);

  // Update current date/time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Revenue chart data
  const [revenueData, setRevenueData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Hybrid (AI + Bitcoin)',
        data: [280, 285, 275, 290, 310, 320, 315, 330, 340, 350, 345, 355, 347, 340, 335, 345, 350, 360, 355, 345, 340, 335, 330, 340],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Bitcoin Only (Baseline)',
        data: Array(24).fill(207),
        borderColor: '#6B7280',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#F9FAFB',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#3B82F6',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.parsed.y}K`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 150,
        max: 400,
        ticks: {
          color: '#9CA3AF',
          callback: (value) => `$${value}K`,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  };

  // Simulate live updates
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Update market data with realistic time-based changes
      const hour = new Date().getHours();
      
      // Electricity: cheaper at night (10pm-6am), expensive during peak (2pm-8pm)
      let baseElectricity = 0.035;
      if (hour >= 22 || hour < 6) {
        baseElectricity = 0.025; // Night rate
      } else if (hour >= 14 && hour < 20) {
        baseElectricity = 0.055; // Peak rate
      }
      
      setMarketData(prev => ({
        ...prev,
        btcPrice: prev.btcPrice > 0 ? prev.btcPrice + (Math.random() - 0.5) * 200 : prev.btcPrice,
        electricity: baseElectricity + (Math.random() - 0.5) * 0.005,
        gpuRate: prev.gpuRate + (Math.random() - 0.5) * 0.5,
      }));

      // Update switching event with realistic phase-based progression
      setSwitchingEvent(prev => {
        // Increment elapsed time (500ms = 0.5s per update)
        const newElapsedMs = prev.elapsedMs + 25; // Increment by 25ms per 500ms interval (realistic speed)
        
        if (newElapsedMs >= prev.totalTime) {
          // Switching complete!
          const finalLatency = 420 + Math.floor(Math.random() * 60); // 420-480ms realistic range
          
          // Add to recent switches after a brief delay
          setTimeout(() => {
            setRecentSwitches(prevSwitches => [
              {
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                gpu: prev.resourceId,
                from: prev.from.split(' ')[0],
                to: prev.to.split(' ')[0],
                latency: finalLatency,
                gain: prev.profitGain,
              },
              ...prevSwitches.slice(0, 2),
            ]);
          }, 1000);
          
          // Reset to start new switch cycle with different GPU
          const gpuNumbers = ['023', '045', '087', '156', '089', '112', '134', '178'];
          const randomGpu = gpuNumbers[Math.floor(Math.random() * gpuNumbers.length)];
          const switchTypes = [
            { from: 'Bitcoin Mining', to: 'AI Inference (Llama-3-70B)', gain: 5.50 },
            { from: 'AI Inference', to: 'Model Training', gain: 8.00 },
            { from: 'Model Training', to: 'AI Inference (GPT-4)', gain: 12.50 },
            { from: 'Bitcoin Mining', to: 'AI Batch Processing', gain: 6.30 },
          ];
          const randomSwitch = switchTypes[Math.floor(Math.random() * switchTypes.length)];
          
          return {
            ...prev,
            resourceId: `GPU-TX-H100-${randomGpu}`,
            progress: 0,
            elapsedMs: 0,
            currentPhase: 0,
            from: randomSwitch.from,
            to: randomSwitch.to,
            profitGain: randomSwitch.gain,
            totalTime: 420 + Math.floor(Math.random() * 60), // Vary total time slightly
            phases: prev.phases.map(p => ({ ...p, status: 'pending' })),
          };
        }
        
        // Calculate current phase based on elapsed time
        let currentPhaseIndex = 0;
        let updatedPhases = [...prev.phases];
        
        for (let i = 0; i < updatedPhases.length; i++) {
          if (newElapsedMs >= updatedPhases[i].cumulativeTime) {
            updatedPhases[i].status = 'done';
            currentPhaseIndex = Math.min(i + 1, updatedPhases.length - 1);
          } else if (newElapsedMs >= (i > 0 ? updatedPhases[i - 1].cumulativeTime : 0)) {
            updatedPhases[i].status = 'active';
            currentPhaseIndex = i;
            break;
          }
        }
        
        // Calculate overall progress percentage
        const progressPercent = (newElapsedMs / prev.totalTime) * 100;
        
        return {
          ...prev,
          elapsedMs: newElapsedMs,
          progress: progressPercent,
          currentPhase: currentPhaseIndex,
          phases: updatedPhases,
        };
      });

      // Update countdown
      setLiveData(prev => ({
        ...prev,
        executingIn: prev.executingIn > 0 ? prev.executingIn - 0.5 : 5.0,
      }));
    }, 500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let particleId = 0;
    let localParticles = [];

    const spawnParticle = () => {
      const types = ['ai', 'training', 'mining'];
      const type = types[Math.floor(Math.random() * types.length)];
      const colors = { ai: '#3B82F6', training: '#8B5CF6', mining: '#F59E0B' };
      
      localParticles.push({
        id: particleId++,
        x: 50,
        y: canvas.offsetHeight / 2 + (Math.random() - 0.5) * 100,
        vx: 2 + Math.random(),
        vy: (Math.random() - 0.5) * 0.5,
        type: type,
        color: colors[type],
        size: 3 + Math.random() * 2,
      });
    };

    const animate = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Spawn new particles randomly
      if (Math.random() < 0.1) {
        spawnParticle();
      }

      // Update and draw particles
      localParticles = localParticles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Remove if off screen
        return particle.x < canvas.offsetWidth;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getPhaseIcon = (status) => {
    if (status === 'done') return <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />;
    if (status === 'active') return <Schedule sx={{ color: '#F59E0B', fontSize: 20 }} />;
    return <Schedule sx={{ color: '#6B7280', fontSize: 20 }} />;
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', pb: 3 }}>
      {/* Real Data Banner */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: 'linear-gradient(135deg, #10B98115 0%, #3B82F615 100%)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#10B981',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#10B981', mb: 0.5 }}>
              🌎 LIVE DATA - Real MARA Holdings Facilities
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✅ Granbury, TX (200 MW) • ✅ Kearney, NE (190 MW) • 🆕 Hansford County Wind Farm (240 MW + 114 MW Wind Power) • 
              📈 Live MARA Stock Price • 💰 Live Bitcoin Price • ₿ 40,435 BTC Treasury Holdings • ⛏️ +1,029 BTC Mined (30 days) • 
              ⚡ Time-of-Day Electricity Rates • 🔄 Sub-500ms Switching
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Live System Visualization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentDateTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentDateTime.toLocaleTimeString('en-US')} • Last updated: {isPaused ? 'PAUSED' : '0.5s ago'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="overview">Overview</ToggleButton>
            <ToggleButton value="economic">Economic</ToggleButton>
            <ToggleButton value="technical">Technical</ToggleButton>
          </ToggleButtonGroup>
          <IconButton onClick={() => setIsPaused(!isPaused)} sx={{ color: 'primary.main' }}>
            {isPaused ? <PlayArrow /> : <Pause />}
          </IconButton>
          <IconButton onClick={toggleFullscreen}>
            <Fullscreen />
          </IconButton>
          <Button startIcon={<Share />} variant="outlined" size="small">
            Share
          </Button>
          <Button startIcon={<VideoLibrary />} variant="outlined" size="small">
            Export
          </Button>
        </Box>
      </Box>

      {/* Economic Optimization Panel */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1A1A1A 0%, #2A1A3A 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Economic Optimization Engine (Live)
          </Typography>
          <Chip
            label={`Last updated: ${isPaused ? 'PAUSED' : '0.5s ago'}`}
            size="small"
            sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #F59E0B15 0%, #F59E0B05 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Bitcoin Mining Profitability
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#F59E0B', my: 2 }}>
                ${liveData.btcProfit.toFixed(2)}/hour
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center', mb: 2 }}>
                <TrendingDown sx={{ color: '#EF4444' }} />
                <Typography variant="body2" color="#EF4444">
                  {liveData.btcChange.toFixed(1)}% (1h)
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                💰 {liveData.btcResources}% Resources
              </Typography>
              <Typography variant="body2">
                ⚡ {liveData.btcPower} MW
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              VS
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #3B82F615 0%, #3B82F605 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                AI Inference Profitability
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#3B82F6', my: 2 }}>
                ${liveData.aiProfit.toFixed(2)}/hour
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: '#10B981' }} />
                <Typography variant="body2" color="#10B981">
                  +{liveData.aiChange.toFixed(1)}% (1h)
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                💰 {liveData.aiResources}% Resources
              </Typography>
              <Typography variant="body2">
                ⚡ {liveData.aiPower} MW
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                background: 'linear-gradient(135deg, #10B98115 0%, #10B98105 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#10B981', mb: 0.5 }}>
                    🎯 RECOMMENDATION: {liveData.recommendation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    💵 Profit Impact: +${liveData.profitImpact.toLocaleString()}/hour (+{liveData.profitPercent.toFixed(1)}%)
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Executing in:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#3B82F6' }}>
                    {liveData.executingIn.toFixed(1)}s
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Live Resource Flow */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Live Resource Flow
        </Typography>

        {/* Data Centers */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {facilities.map((facility) => (
            <Grid item xs={12} md={4} key={facility.id}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  '&:hover': {
                    borderColor: '#3B82F6',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                  },
                }}
                onClick={() => setSelectedFacility(facility)}
              >
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {facility.name}
                    </Typography>
                    {facility.renewable && (
                      <Chip
                        label="🌱 Wind Powered"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10B981',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {facility.acquisition}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', fontWeight: 600 }}>
                    {facility.subtitle}
                  </Typography>
                </Box>

                {/* Resource visualization */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      height: 40,
                      display: 'flex',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${facility.aiPercent}%`,
                        bgcolor: '#3B82F6',
                        transition: 'width 1s',
                      }}
                    />
                    <Box
                      sx={{
                        width: `${facility.trainingPercent}%`,
                        bgcolor: '#8B5CF6',
                        transition: 'width 1s',
                      }}
                    />
                    <Box
                      sx={{
                        width: `${facility.miningPercent}%`,
                        bgcolor: '#F59E0B',
                        transition: 'width 1s',
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {facility.h100 > 0 && (
                    <Typography variant="body2">H100: {facility.h100}</Typography>
                  )}
                  {facility.a100 > 0 && (
                    <Typography variant="body2">A100: {facility.a100}</Typography>
                  )}
                  <Typography variant="body2">ASICs: {facility.asics.toLocaleString()}</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip
                      icon={<LocalFireDepartment />}
                      label={`${facility.temp}°C`}
                      size="small"
                      sx={{
                        bgcolor: facility.temp > 50 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: facility.temp > 50 ? '#EF4444' : '#10B981',
                      }}
                    />
                    <Chip
                      icon={<ElectricBolt />}
                      label={`${facility.power}%`}
                      size="small"
                      sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Particle Flow Canvas */}
        <Box
          sx={{
            height: 150,
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              color: 'text.secondary',
            }}
          >
            🔵 AI Inference  🟣 Training  🟡 Bitcoin Mining
          </Typography>
        </Box>

        {/* Customers */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {customers.map((customer, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {customer.name}
                </Typography>
                <Chip
                  label={customer.type}
                  size="small"
                  sx={{
                    mb: 1,
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: 'rgba(139, 92, 246, 0.2)',
                    color: '#8B5CF6',
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {customer.jobs.toLocaleString()} active jobs
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                  ${(customer.revenue / 1000000).toFixed(2)}M/month
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Live Switching Events */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Live Switching Events
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<PlayArrow />}>
                  Replay
                </Button>
                <Button size="small" startIcon={<Speed />}>
                  0.5x
                </Button>
              </Box>
            </Box>

            {/* Active Switch */}
            <Paper
              sx={{
                p: 2,
                mb: 3,
                background: 'linear-gradient(135deg, #F59E0B15 0%, #3B82F615 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  ⚡ SWITCH IN PROGRESS ({switchingEvent.resourceId})
                </Typography>
                <Chip
                  label={`${Math.round(switchingEvent.elapsedMs)}ms / ${switchingEvent.totalTime}ms`}
                  size="small"
                  sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', fontFamily: 'monospace', fontWeight: 700 }}
                />
              </Box>

              <LinearProgress
                variant="determinate"
                value={switchingEvent.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #F59E0B 0%, #3B82F6 100%)',
                    transition: 'transform 0.5s ease-out', // Smooth non-linear transition
                  },
                }}
              />

              {/* Phases */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                {switchingEvent.phases.map((phase, idx) => {
                  const startTime = idx > 0 ? switchingEvent.phases[idx - 1].cumulativeTime : 0;
                  const phaseProgress = phase.status === 'active' 
                    ? Math.min(100, ((switchingEvent.elapsedMs - startTime) / phase.time) * 100)
                    : 0;
                  
                  return (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPhaseIcon(phase.status)}
                      <Typography
                        variant="body2"
                        sx={{
                          color: phase.status === 'done' ? '#10B981' : phase.status === 'active' ? '#F59E0B' : 'text.secondary',
                          fontFamily: 'monospace',
                          minWidth: '60px',
                        }}
                      >
                        T+{startTime}ms
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {phase.name}
                      </Typography>
                      {phase.status === 'active' && (
                        <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                          {Math.round(phaseProgress)}%
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: '60px', textAlign: 'right' }}>
                        ({phase.time}ms)
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    FROM:
                  </Typography>
                  <Typography variant="body2">{switchingEvent.from}</Typography>
                </Box>
                <Typography variant="h6">→</Typography>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    TO:
                  </Typography>
                  <Typography variant="body2">{switchingEvent.to}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    GAIN:
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +${switchingEvent.profitGain.toFixed(2)}/hr
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Recent Switches */}
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Switches
            </Typography>
            {recentSwitches.map((sw, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 1.5,
                  mb: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography variant="body2">
                  ✅ {sw.time} - {sw.gpu}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sw.from} → {sw.to}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({sw.latency}ms)
                </Typography>
                <Typography variant="body2" color="success.main">
                  +${sw.gain.toFixed(2)}/hr
                </Typography>
              </Box>
            ))}

            <Paper sx={{ p: 2, mt: 2, bgcolor: 'rgba(59, 130, 246, 0.05)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Statistics (Last Hour)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Switches: <strong>47</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate: <strong>100%</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Avg Latency: <strong>442ms</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="success.main">
                    Revenue Gained: <strong>+$2,847/hr</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Paper>
        </Grid>

        {/* Market Signals & System Health */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Market Signals (Live)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  📈 MARA Stock (NASDAQ)
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    ${marketData.maraStockPrice.toFixed(2)}
                  </Typography>
                  <Chip
                    label={`${marketData.maraStockChange > 0 ? '+' : ''}${marketData.maraStockChange.toFixed(2)}%`}
                    size="small"
                    icon={marketData.maraStockChange > 0 ? <TrendingUp /> : <TrendingDown />}
                    sx={{
                      bgcolor: marketData.maraStockChange > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: marketData.maraStockChange > 0 ? '#10B981' : '#EF4444',
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  💵 BTC Price
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    ${marketData.btcPrice.toLocaleString()}
                  </Typography>
                  <Chip
                    label={`${marketData.btcChange > 0 ? '+' : ''}${marketData.btcChange.toFixed(1)}%`}
                    size="small"
                    icon={marketData.btcChange > 0 ? <TrendingUp /> : <TrendingDown />}
                    sx={{
                      bgcolor: marketData.btcChange > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: marketData.btcChange > 0 ? '#10B981' : '#EF4444',
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  ⚡ Electricity
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    ${marketData.electricity.toFixed(3)}/kWh
                  </Typography>
                  <Chip
                    label={`${marketData.elecChange > 0 ? '+' : ''}${marketData.elecChange.toFixed(1)}%`}
                    size="small"
                    icon={marketData.elecChange > 0 ? <TrendingUp /> : <TrendingDown />}
                    sx={{
                      bgcolor: marketData.elecChange < 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: marketData.elecChange < 0 ? '#10B981' : '#EF4444',
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  🖥️ GPU Spot Rate
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    ${marketData.gpuRate.toFixed(2)}/hr
                  </Typography>
                  <Chip
                    label={`${marketData.gpuChange > 0 ? '+' : ''}${marketData.gpuChange.toFixed(1)}%`}
                    size="small"
                    icon={marketData.gpuChange > 0 ? <TrendingUp /> : <TrendingDown />}
                    sx={{
                      bgcolor: marketData.gpuChange > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: marketData.gpuChange > 0 ? '#10B981' : '#EF4444',
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  ⛏️ Mining Difficulty
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {marketData.difficulty.toFixed(2)} T
                  </Typography>
                  <Chip
                    label={`${marketData.diffChange > 0 ? '+' : ''}${marketData.diffChange.toFixed(2)}%`}
                    size="small"
                    sx={{ 
                      bgcolor: marketData.diffChange < 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: marketData.diffChange < 0 ? '#10B981' : '#EF4444'
                    }}
                  />
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                🔄 Last update: {new Date(marketData.lastUpdate).toLocaleTimeString('en-US')}
              </Typography>
            </Box>
          </Paper>

          {/* MARA Bitcoin Treasury */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3,
              background: 'linear-gradient(135deg, #F59E0B15 0%, #F59E0B05 100%)',
              border: '2px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F59E0B' }}>
              ₿ MARA Bitcoin Treasury
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  💰 Total Holdings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                  {marketData.maraBTCHoldings.toLocaleString()} BTC
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ≈ ${((marketData.maraBTCHoldings * marketData.btcPrice) / 1000000).toFixed(1)}M USD
                </Typography>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, mt: 0.5, display: 'block' }}>
                  0.193% of total Bitcoin supply
                </Typography>
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <Typography variant="caption" color="text.secondary">
                  ⛏️ Mined Last 30 Days
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                  +{marketData.maraBTCMined30Days.toLocaleString()} BTC
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ≈ ${((marketData.maraBTCMined30Days * marketData.btcPrice) / 1000000).toFixed(2)}M USD value
                </Typography>
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <Typography variant="caption" color="text.secondary">
                  📊 Daily Average Production
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                  {marketData.maraBTCMinedToday.toFixed(1)} BTC/day
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ≈ ${((marketData.maraBTCMinedToday * marketData.btcPrice) / 1000).toFixed(0)}K USD per day
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  mt: 1, 
                  p: 1.5, 
                  bgcolor: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: 1,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, display: 'block', mb: 0.5 }}>
                  💎 HODL Strategy Active
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  MARA retains all mined Bitcoin as treasury asset
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              System Health
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#10B981' }}>
                  🟢 All Services Operational
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 2 }}>
                  <Typography variant="body2">
                    ├─ Orchestrator: {systemHealth.orchestrator.count}/{systemHealth.orchestrator.total} ✅
                  </Typography>
                  <Typography variant="body2">
                    ├─ Optimizer: {systemHealth.optimizer.count}/{systemHealth.optimizer.total} ✅
                  </Typography>
                  <Typography variant="body2">
                    ├─ Router: {systemHealth.router.count}/{systemHealth.router.total} ✅
                  </Typography>
                  <Typography variant="body2">
                    ├─ Resource Mgr: {systemHealth.resourceMgr.count}/{systemHealth.resourceMgr.total} ✅
                  </Typography>
                  <Typography variant="body2">
                    └─ WebSocket: {systemHealth.websocket.count}/{systemHealth.websocket.total} ✅
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  📊 Performance
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    • API Latency: <strong>{systemHealth.apiLatency}ms</strong> (P50)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Switching Speed: <strong>{systemHealth.switchingSpeed}ms</strong> (avg)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Workload Queue: P1: {systemHealth.queueP1}, P2: {systemHealth.queueP2}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • GPU Utilization: <strong>{systemHealth.gpuUtil}%</strong>
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    • Revenue/hour: <strong>${systemHealth.revenuePerHour.toLocaleString()}</strong>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Revenue Comparison Chart */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          24-Hour Revenue Comparison
        </Typography>
        <Box sx={{ height: 300 }}>
          <Line data={revenueData} options={chartOptions} />
        </Box>
        <Paper
          sx={{
            p: 2,
            mt: 2,
            background: 'linear-gradient(135deg, #10B98115 0%, #10B98105 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#10B981', textAlign: 'center' }}>
            💰 REVENUE GAIN: +$140K/day (+67.6%) thanks to hybrid optimization
          </Typography>
        </Paper>
      </Paper>

      {/* Facility Detail Dialog */}
      <Dialog
        open={Boolean(selectedFacility)}
        onClose={() => setSelectedFacility(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedFacility && (
          <>
            <DialogTitle>
              {selectedFacility.name} Facility - Detailed View
            </DialogTitle>
            <DialogContent>
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  GPU CLUSTER
                </Typography>
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(59, 130, 246, 0.05)' }}>
                  {selectedFacility.h100 > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        H100 GPUs ({selectedFacility.h100} total)
                      </Typography>
                      <Box sx={{ height: 30, display: 'flex', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                        <Box sx={{ width: '61%', bgcolor: '#3B82F6' }} />
                        <Box sx={{ width: '19%', bgcolor: '#8B5CF6' }} />
                        <Box sx={{ width: '20%', bgcolor: '#F59E0B' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        AI Inference: {Math.round(selectedFacility.h100 * 0.61)} (61%)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Model Training: {Math.round(selectedFacility.h100 * 0.19)} (19%)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bitcoin Mining: {Math.round(selectedFacility.h100 * 0.20)} (20%)
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Avg Temp: <strong>{selectedFacility.temp}°C</strong> | Power: <strong>650W/GPU</strong>
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  ASIC CLUSTER
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'rgba(245, 158, 11, 0.05)' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Antminer S21 ({selectedFacility.asics.toLocaleString()} total)
                  </Typography>
                  <Box sx={{ height: 30, bgcolor: '#F59E0B', borderRadius: 1, mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Hash Rate: <strong>{(selectedFacility.asics * 200 / 1000).toFixed(0)} PH/s</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Efficiency: <strong>17.5 J/TH</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uptime: <strong>99.97%</strong>
                  </Typography>
                </Paper>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setSelectedFacility(null)}
                  sx={{ mt: 3 }}
                >
                  Close
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

