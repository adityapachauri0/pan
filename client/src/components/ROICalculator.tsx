import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalculator, FaDollarSign, FaChartLine, FaUsers, FaShoppingCart, FaRocket, FaCheckCircle } from 'react-icons/fa';
import './ROICalculator.css';

interface CalculatorInputs {
  monthlyVisitors: number;
  conversionRate: number;
  averageOrderValue: number;
  currentRevenue: number;
}

interface ROIResults {
  improvedConversionRate: number;
  additionalCustomers: number;
  additionalRevenue: number;
  yearlyRevenue: number;
  roi: number;
  paybackPeriod: number;
}

const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyVisitors: 10000,
    conversionRate: 2,
    averageOrderValue: 100,
    currentRevenue: 20000
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [projectCost, setProjectCost] = useState(15000);
  const [showResults, setShowResults] = useState(false);

  // Industry benchmarks for improvements
  const improvements = {
    conversionRateIncrease: 35, // 35% improvement in conversion rate
    trafficIncrease: 25, // 25% increase in organic traffic
    averageOrderIncrease: 15, // 15% increase in average order value
    customerRetention: 20 // 20% improvement in customer retention
  };

  const calculateROI = () => {
    // Calculate improved metrics
    const improvedVisitors = inputs.monthlyVisitors * (1 + improvements.trafficIncrease / 100);
    const improvedConversionRate = inputs.conversionRate * (1 + improvements.conversionRateIncrease / 100);
    const improvedAOV = inputs.averageOrderValue * (1 + improvements.averageOrderIncrease / 100);
    
    // Calculate current and improved customers
    const currentCustomers = (inputs.monthlyVisitors * inputs.conversionRate) / 100;
    const improvedCustomers = (improvedVisitors * improvedConversionRate) / 100;
    const additionalCustomers = improvedCustomers - currentCustomers;
    
    // Calculate revenue
    const improvedMonthlyRevenue = improvedCustomers * improvedAOV;
    const additionalRevenue = improvedMonthlyRevenue - inputs.currentRevenue;
    const yearlyRevenue = additionalRevenue * 12;
    
    // Calculate ROI
    const roi = ((yearlyRevenue - projectCost) / projectCost) * 100;
    const paybackPeriod = projectCost / additionalRevenue;
    
    setResults({
      improvedConversionRate,
      additionalCustomers: Math.round(additionalCustomers),
      additionalRevenue: Math.round(additionalRevenue),
      yearlyRevenue: Math.round(yearlyRevenue),
      roi: Math.round(roi),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10
    });
    
    setShowResults(true);
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
    setShowResults(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <section className="roi-calculator-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="calculator-header"
        >
          <span className="section-label">ROI Calculator</span>
          <h2 className="section-title">
            Calculate Your <span className="gradient-text">Return on Investment</span>
          </h2>
          <p className="section-description">
            See how much revenue a new website could generate for your business
          </p>
        </motion.div>

        <div className="calculator-container">
          <motion.div 
            className="calculator-inputs"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Your Current Metrics</h3>
            
            <div className="input-group">
              <label>
                <FaUsers className="input-icon" />
                <span>Monthly Website Visitors</span>
              </label>
              <input
                type="number"
                value={inputs.monthlyVisitors}
                onChange={(e) => handleInputChange('monthlyVisitors', e.target.value)}
                placeholder="10000"
              />
            </div>

            <div className="input-group">
              <label>
                <FaChartLine className="input-icon" />
                <span>Current Conversion Rate (%)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.conversionRate}
                onChange={(e) => handleInputChange('conversionRate', e.target.value)}
                placeholder="2"
              />
            </div>

            <div className="input-group">
              <label>
                <FaShoppingCart className="input-icon" />
                <span>Average Order Value ($)</span>
              </label>
              <input
                type="number"
                value={inputs.averageOrderValue}
                onChange={(e) => handleInputChange('averageOrderValue', e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="input-group">
              <label>
                <FaDollarSign className="input-icon" />
                <span>Current Monthly Revenue ($)</span>
              </label>
              <input
                type="number"
                value={inputs.currentRevenue}
                onChange={(e) => handleInputChange('currentRevenue', e.target.value)}
                placeholder="20000"
              />
            </div>

            <div className="improvements-preview">
              <h4>Expected Improvements</h4>
              <div className="improvement-item">
                <FaCheckCircle className="check-icon" />
                <span>+{improvements.conversionRateIncrease}% Conversion Rate</span>
              </div>
              <div className="improvement-item">
                <FaCheckCircle className="check-icon" />
                <span>+{improvements.trafficIncrease}% Organic Traffic</span>
              </div>
              <div className="improvement-item">
                <FaCheckCircle className="check-icon" />
                <span>+{improvements.averageOrderIncrease}% Average Order Value</span>
              </div>
              <div className="improvement-item">
                <FaCheckCircle className="check-icon" />
                <span>+{improvements.customerRetention}% Customer Retention</span>
              </div>
            </div>

            <button 
              className="calculate-btn"
              onClick={calculateROI}
            >
              <FaCalculator />
              Calculate ROI
            </button>
          </motion.div>

          <motion.div 
            className="calculator-results"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Your Projected Results</h3>
            
            <AnimatePresence mode="wait">
              {showResults && results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="results-content"
                >
                  <div className="result-card highlight">
                    <div className="result-icon">
                      <FaRocket />
                    </div>
                    <div className="result-details">
                      <span className="result-label">Return on Investment</span>
                      <span className="result-value roi-value">{results.roi}%</span>
                      <span className="result-note">First Year ROI</span>
                    </div>
                  </div>

                  <div className="result-card">
                    <div className="result-icon">
                      <FaDollarSign />
                    </div>
                    <div className="result-details">
                      <span className="result-label">Additional Monthly Revenue</span>
                      <span className="result-value">{formatCurrency(results.additionalRevenue)}</span>
                      <span className="result-note">Per Month</span>
                    </div>
                  </div>

                  <div className="result-card">
                    <div className="result-icon">
                      <FaChartLine />
                    </div>
                    <div className="result-details">
                      <span className="result-label">Annual Revenue Increase</span>
                      <span className="result-value">{formatCurrency(results.yearlyRevenue)}</span>
                      <span className="result-note">Per Year</span>
                    </div>
                  </div>

                  <div className="result-card">
                    <div className="result-icon">
                      <FaUsers />
                    </div>
                    <div className="result-details">
                      <span className="result-label">New Customers</span>
                      <span className="result-value">+{formatNumber(results.additionalCustomers)}</span>
                      <span className="result-note">Per Month</span>
                    </div>
                  </div>

                  <div className="payback-period">
                    <div className="payback-content">
                      <span className="payback-label">Investment Payback Period</span>
                      <span className="payback-value">{results.paybackPeriod} months</span>
                    </div>
                    <div className="payback-bar">
                      <motion.div 
                        className="payback-progress"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((1 / results.paybackPeriod) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="investment-note">
                    <p>Based on an estimated investment of {formatCurrency(projectCost)}</p>
                    <p className="disclaimer">* Results based on industry averages and may vary</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="empty-results"
                >
                  <div className="empty-icon">
                    <FaCalculator />
                  </div>
                  <p>Enter your business metrics and click "Calculate ROI" to see your potential returns</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {showResults && results && (
              <motion.div 
                className="cta-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h4>Ready to Achieve These Results?</h4>
                <p>Let's discuss how we can help grow your business</p>
                <button className="cta-button primary">Get Your Custom Quote</button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;