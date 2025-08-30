import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTachometerAlt, FaChartLine, FaUsers, FaGlobe,
  FaMobile, FaDesktop, FaTabletAlt, FaClock,
  FaArrowUp, FaArrowDown, FaEquals, FaCheckCircle,
  FaExclamationTriangle, FaTimesCircle, FaRocket,
  FaShieldAlt, FaSearch, FaCode, FaServer,
  FaWifi, FaDatabase, FaMemory, FaMicrochip
} from 'react-icons/fa';
import './PerformanceMetrics.css';

interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  status?: 'good' | 'warning' | 'critical';
  icon?: React.ReactNode;
}

interface PerformanceData {
  score: number;
  metrics: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
    tti: number; // Time to Interactive
  };
}

interface Analytics {
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  conversionRate: number;
  activeUsers: number;
}

const PerformanceMetrics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    score: 95,
    metrics: {
      fcp: 1.2,
      lcp: 2.1,
      fid: 45,
      cls: 0.05,
      ttfb: 0.8,
      tti: 3.5
    }
  });

  const [analytics, setAnalytics] = useState<Analytics>({
    visitors: 12450,
    pageViews: 45200,
    bounceRate: 32,
    avgSessionDuration: '3:45',
    conversionRate: 4.2,
    activeUsers: 342
  });

  const [realTimeData, setRealTimeData] = useState({
    cpu: 45,
    memory: 62,
    bandwidth: 78,
    requests: 1250,
    responseTime: 120,
    errorRate: 0.2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(20, prev.memory + (Math.random() - 0.5) * 5)),
        bandwidth: Math.min(100, Math.max(30, prev.bandwidth + (Math.random() - 0.5) * 15)),
        requests: Math.max(100, prev.requests + Math.floor(Math.random() * 50 - 20)),
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 20),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5))
      }));

      setAnalytics(prev => ({
        ...prev,
        activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 20 - 10))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 50) return '#FF9800';
    return '#f44336';
  };

  const getMetricStatus = (metric: string, value: number): 'good' | 'warning' | 'critical' => {
    const thresholds: { [key: string]: { good: number; warning: number } } = {
      fcp: { good: 1.8, warning: 3 },
      lcp: { good: 2.5, warning: 4 },
      fid: { good: 100, warning: 300 },
      cls: { good: 0.1, warning: 0.25 },
      ttfb: { good: 0.8, warning: 1.8 },
      tti: { good: 3.8, warning: 7.3 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.warning) return 'warning';
    return 'critical';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const coreWebVitals = [
    {
      name: 'FCP',
      label: 'First Contentful Paint',
      value: performanceData.metrics.fcp,
      unit: 's',
      status: getMetricStatus('fcp', performanceData.metrics.fcp),
      description: 'Time when first text or image is painted'
    },
    {
      name: 'LCP',
      label: 'Largest Contentful Paint',
      value: performanceData.metrics.lcp,
      unit: 's',
      status: getMetricStatus('lcp', performanceData.metrics.lcp),
      description: 'Time when largest content element becomes visible'
    },
    {
      name: 'FID',
      label: 'First Input Delay',
      value: performanceData.metrics.fid,
      unit: 'ms',
      status: getMetricStatus('fid', performanceData.metrics.fid),
      description: 'Time from user interaction to browser response'
    },
    {
      name: 'CLS',
      label: 'Cumulative Layout Shift',
      value: performanceData.metrics.cls,
      unit: '',
      status: getMetricStatus('cls', performanceData.metrics.cls),
      description: 'Visual stability of the page'
    }
  ];

  const trafficSources = [
    { source: 'Organic Search', percentage: 45, color: '#4CAF50' },
    { source: 'Direct', percentage: 25, color: '#2196F3' },
    { source: 'Social Media', percentage: 18, color: '#FF9800' },
    { source: 'Referral', percentage: 8, color: '#9C27B0' },
    { source: 'Email', percentage: 4, color: '#F44336' }
  ];

  const deviceBreakdown = [
    { device: 'Desktop', icon: <FaDesktop />, percentage: 52, users: 6474 },
    { device: 'Mobile', icon: <FaMobile />, percentage: 42, users: 5229 },
    { device: 'Tablet', icon: <FaTabletAlt />, percentage: 6, users: 747 }
  ];

  const topPages = [
    { page: '/home', views: 12500, avgTime: '2:45', bounceRate: 25 },
    { page: '/services', views: 8200, avgTime: '3:20', bounceRate: 35 },
    { page: '/portfolio', views: 6800, avgTime: '4:15', bounceRate: 28 },
    { page: '/pricing', views: 5400, avgTime: '2:30', bounceRate: 42 },
    { page: '/contact', views: 3200, avgTime: '1:45', bounceRate: 15 }
  ];

  return (
    <section className="performance-metrics">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Real-Time Performance Metrics</h2>
          <p>Monitor your website's performance and user analytics</p>
        </motion.div>

        <motion.div 
          className="metrics-controls"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="period-selector">
            <button 
              className={selectedPeriod === '24h' ? 'active' : ''}
              onClick={() => setSelectedPeriod('24h')}
            >
              Last 24 Hours
            </button>
            <button 
              className={selectedPeriod === '7d' ? 'active' : ''}
              onClick={() => setSelectedPeriod('7d')}
            >
              Last 7 Days
            </button>
            <button 
              className={selectedPeriod === '30d' ? 'active' : ''}
              onClick={() => setSelectedPeriod('30d')}
            >
              Last 30 Days
            </button>
          </div>
          <div className="live-indicator">
            <span className="pulse"></span>
            <span>Live Data</span>
          </div>
        </motion.div>

        {/* Performance Score */}
        <motion.div 
          className="performance-score-card"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="score-circle">
            <svg viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="10"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={getScoreColor(performanceData.score)}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(performanceData.score / 100) * 565.48} 565.48`}
                transform="rotate(-90 100 100)"
                initial={{ strokeDasharray: "0 565.48" }}
                animate={{ strokeDasharray: `${(performanceData.score / 100) * 565.48} 565.48` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="score-text">
              <span className="score-value">{performanceData.score}</span>
              <span className="score-label">Performance Score</span>
            </div>
          </div>
          <div className="score-details">
            <h3>Overall Performance</h3>
            <p>Your website is performing excellently with fast load times and great user experience.</p>
            <div className="score-badges">
              <span className="badge good">
                <FaCheckCircle /> Optimized
              </span>
              <span className="badge good">
                <FaRocket /> Fast Loading
              </span>
              <span className="badge good">
                <FaShieldAlt /> Secure
              </span>
            </div>
          </div>
        </motion.div>

        {/* Core Web Vitals */}
        <motion.div 
          className="web-vitals"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3>Core Web Vitals</h3>
          <div className="vitals-grid">
            {coreWebVitals.map((vital, index) => (
              <motion.div
                key={vital.name}
                className={`vital-card ${vital.status}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="vital-header">
                  <span className="vital-name">{vital.name}</span>
                  <span className={`status-icon ${vital.status}`}>
                    {vital.status === 'good' && <FaCheckCircle />}
                    {vital.status === 'warning' && <FaExclamationTriangle />}
                    {vital.status === 'critical' && <FaTimesCircle />}
                  </span>
                </div>
                <div className="vital-value">
                  {vital.value}
                  <span className="vital-unit">{vital.unit}</span>
                </div>
                <p className="vital-label">{vital.label}</p>
                <p className="vital-description">{vital.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Server Metrics */}
        <motion.div 
          className="server-metrics"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3>Server Performance</h3>
          <div className="server-grid">
            <div className="server-metric">
              <div className="metric-header">
                <FaMicrochip />
                <span>CPU Usage</span>
              </div>
              <div className="metric-value">
                <span className="value">{realTimeData.cpu.toFixed(1)}%</span>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    style={{ 
                      width: `${realTimeData.cpu}%`,
                      backgroundColor: realTimeData.cpu > 80 ? '#f44336' : realTimeData.cpu > 60 ? '#FF9800' : '#4CAF50'
                    }}
                    animate={{ width: `${realTimeData.cpu}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            <div className="server-metric">
              <div className="metric-header">
                <FaMemory />
                <span>Memory Usage</span>
              </div>
              <div className="metric-value">
                <span className="value">{realTimeData.memory.toFixed(1)}%</span>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    style={{ 
                      width: `${realTimeData.memory}%`,
                      backgroundColor: realTimeData.memory > 80 ? '#f44336' : realTimeData.memory > 60 ? '#FF9800' : '#4CAF50'
                    }}
                    animate={{ width: `${realTimeData.memory}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            <div className="server-metric">
              <div className="metric-header">
                <FaWifi />
                <span>Bandwidth</span>
              </div>
              <div className="metric-value">
                <span className="value">{realTimeData.bandwidth.toFixed(1)}%</span>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    style={{ 
                      width: `${realTimeData.bandwidth}%`,
                      backgroundColor: realTimeData.bandwidth > 90 ? '#f44336' : realTimeData.bandwidth > 70 ? '#FF9800' : '#4CAF50'
                    }}
                    animate={{ width: `${realTimeData.bandwidth}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            <div className="server-metric">
              <div className="metric-header">
                <FaServer />
                <span>Requests/min</span>
              </div>
              <div className="metric-value">
                <span className="value">{realTimeData.requests}</span>
              </div>
            </div>

            <div className="server-metric">
              <div className="metric-header">
                <FaClock />
                <span>Response Time</span>
              </div>
              <div className="metric-value">
                <span className="value">{realTimeData.responseTime}ms</span>
              </div>
            </div>

            <div className="server-metric">
              <div className="metric-header">
                <FaExclamationTriangle />
                <span>Error Rate</span>
              </div>
              <div className="metric-value">
                <span className="value" style={{ color: realTimeData.errorRate > 1 ? '#f44336' : '#4CAF50' }}>
                  {realTimeData.errorRate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Overview */}
        <motion.div 
          className="analytics-overview"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3>Analytics Overview</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="card-icon visitors">
                <FaUsers />
              </div>
              <div className="card-content">
                <span className="card-value">{formatNumber(analytics.visitors)}</span>
                <span className="card-label">Total Visitors</span>
                <span className="card-change positive">
                  <FaArrowUp /> 12.5%
                </span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon pageviews">
                <FaGlobe />
              </div>
              <div className="card-content">
                <span className="card-value">{formatNumber(analytics.pageViews)}</span>
                <span className="card-label">Page Views</span>
                <span className="card-change positive">
                  <FaArrowUp /> 8.3%
                </span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon bounce">
                <FaChartLine />
              </div>
              <div className="card-content">
                <span className="card-value">{analytics.bounceRate}%</span>
                <span className="card-label">Bounce Rate</span>
                <span className="card-change negative">
                  <FaArrowDown /> 3.2%
                </span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon duration">
                <FaClock />
              </div>
              <div className="card-content">
                <span className="card-value">{analytics.avgSessionDuration}</span>
                <span className="card-label">Avg. Duration</span>
                <span className="card-change positive">
                  <FaArrowUp /> 15s
                </span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon conversion">
                <FaRocket />
              </div>
              <div className="card-content">
                <span className="card-value">{analytics.conversionRate}%</span>
                <span className="card-label">Conversion Rate</span>
                <span className="card-change positive">
                  <FaArrowUp /> 0.8%
                </span>
              </div>
            </div>

            <div className="analytics-card active">
              <div className="card-icon active-users">
                <FaUsers />
              </div>
              <div className="card-content">
                <span className="card-value">{analytics.activeUsers}</span>
                <span className="card-label">Active Now</span>
                <span className="live-dot"></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Traffic Sources & Device Breakdown */}
        <div className="metrics-row">
          <motion.div 
            className="traffic-sources"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <h3>Traffic Sources</h3>
            <div className="sources-list">
              {trafficSources.map((source, index) => (
                <motion.div
                  key={source.source}
                  className="source-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="source-info">
                    <span className="source-name">{source.source}</span>
                    <span className="source-percentage">{source.percentage}%</span>
                  </div>
                  <div className="source-bar">
                    <motion.div
                      className="source-fill"
                      style={{ backgroundColor: source.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${source.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="device-breakdown"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <h3>Device Breakdown</h3>
            <div className="devices-list">
              {deviceBreakdown.map((device, index) => (
                <motion.div
                  key={device.device}
                  className="device-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="device-icon">{device.icon}</div>
                  <div className="device-info">
                    <span className="device-name">{device.device}</span>
                    <span className="device-percentage">{device.percentage}%</span>
                    <span className="device-users">{formatNumber(device.users)} users</span>
                  </div>
                  <div className="device-chart">
                    <svg viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#667eea"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(device.percentage / 100) * 251.33} 251.33`}
                        transform="rotate(-90 50 50)"
                        initial={{ strokeDasharray: "0 251.33" }}
                        whileInView={{ strokeDasharray: `${(device.percentage / 100) * 251.33} 251.33` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                      />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Pages */}
        <motion.div 
          className="top-pages"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3>Top Performing Pages</h3>
          <div className="pages-table">
            <div className="table-header">
              <span>Page</span>
              <span>Views</span>
              <span>Avg. Time</span>
              <span>Bounce Rate</span>
            </div>
            {topPages.map((page, index) => (
              <motion.div
                key={page.page}
                className="table-row"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}
              >
                <span className="page-name">{page.page}</span>
                <span className="page-views">{formatNumber(page.views)}</span>
                <span className="page-time">{page.avgTime}</span>
                <span className="page-bounce">
                  <span className={`bounce-value ${page.bounceRate < 30 ? 'good' : page.bounceRate < 40 ? 'warning' : 'critical'}`}>
                    {page.bounceRate}%
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PerformanceMetrics;