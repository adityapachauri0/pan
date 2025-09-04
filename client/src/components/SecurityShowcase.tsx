import React, { useState, useEffect } from 'react';
import './SecurityShowcase.css';
import { 
  FaShieldAlt, FaLock, FaKey, FaFingerprint, FaUserShield,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
  FaCertificate, FaServer, FaCloud, FaDatabase, FaNetworkWired,
  FaEye, FaEyeSlash, FaBug, FaCode, FaFireAlt, FaSkull
} from 'react-icons/fa';
import { 
  SiOwasp, SiAuth0, SiCloudflare,
  SiLetsencrypt, SiHashicorp, SiVault
} from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  implementation: string;
  status: 'active' | 'monitoring' | 'updating';
  strength: number;
}

interface ThreatIndicator {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'blocked' | 'mitigated' | 'monitoring';
  timestamp: Date;
  details: string;
}

interface Certification {
  name: string;
  icon: React.ReactNode;
  description: string;
  validUntil: string;
}

const SecurityShowcase: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'features' | 'monitor' | 'audit'>('overview');
  const [selectedFeature, setSelectedFeature] = useState<SecurityFeature | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [threats, setThreats] = useState<ThreatIndicator[]>([]);
  const [securityScore, setSecurityScore] = useState(98);

  const securityFeatures: SecurityFeature[] = [
    {
      id: 'encryption',
      title: 'End-to-End Encryption',
      description: 'AES-256 encryption for all data transmission and storage',
      icon: <FaLock />,
      category: 'Data Protection',
      implementation: 'TLS 1.3, AES-256-GCM',
      status: 'active',
      strength: 100
    },
    {
      id: 'auth',
      title: 'Multi-Factor Authentication',
      description: 'Advanced authentication with biometric and TOTP support',
      icon: <FaFingerprint />,
      category: 'Access Control',
      implementation: 'Auth0, FIDO2, WebAuthn',
      status: 'active',
      strength: 95
    },
    {
      id: 'waf',
      title: 'Web Application Firewall',
      description: 'AI-powered threat detection and prevention',
      icon: <FaShieldAlt />,
      category: 'Network Security',
      implementation: 'Cloudflare WAF, Custom Rules',
      status: 'active',
      strength: 98
    },
    {
      id: 'ddos',
      title: 'DDoS Protection',
      description: 'Enterprise-grade distributed denial of service mitigation',
      icon: <FaNetworkWired />,
      category: 'Network Security',
      implementation: 'Cloudflare, Rate Limiting',
      status: 'active',
      strength: 100
    },
    {
      id: 'secrets',
      title: 'Secrets Management',
      description: 'Secure storage and rotation of API keys and credentials',
      icon: <FaKey />,
      category: 'Data Protection',
      implementation: 'HashiCorp Vault, AWS Secrets Manager',
      status: 'active',
      strength: 97
    },
    {
      id: 'audit',
      title: 'Security Auditing',
      description: 'Continuous monitoring and compliance reporting',
      icon: <FaEye />,
      category: 'Compliance',
      implementation: 'SIEM, Log Analysis, Alerts',
      status: 'monitoring',
      strength: 92
    },
    {
      id: 'backup',
      title: 'Automated Backups',
      description: 'Redundant backups with point-in-time recovery',
      icon: <FaDatabase />,
      category: 'Data Protection',
      implementation: '3-2-1 Backup Strategy',
      status: 'active',
      strength: 100
    },
    {
      id: 'pentest',
      title: 'Penetration Testing',
      description: 'Regular security assessments and vulnerability scanning',
      icon: <FaBug />,
      category: 'Testing',
      implementation: 'Quarterly Pentests, OWASP ZAP',
      status: 'updating',
      strength: 88
    },
    {
      id: 'csp',
      title: 'Content Security Policy',
      description: 'Strict CSP headers to prevent XSS attacks',
      icon: <FaCode />,
      category: 'Application Security',
      implementation: 'CSP Level 3, SRI',
      status: 'active',
      strength: 94
    },
    {
      id: 'rbac',
      title: 'Role-Based Access Control',
      description: 'Granular permissions and least privilege principle',
      icon: <FaUserShield />,
      category: 'Access Control',
      implementation: 'RBAC, ABAC Policies',
      status: 'active',
      strength: 96
    }
  ];

  const certifications: Certification[] = [
    {
      name: 'ISO 27001',
      icon: <FaCertificate />,
      description: 'Information Security Management',
      validUntil: '2025-12-31'
    },
    {
      name: 'SOC 2 Type II',
      icon: <FaCertificate />,
      description: 'Security & Availability',
      validUntil: '2025-06-30'
    },
    {
      name: 'GDPR Compliant',
      icon: <FaCertificate />,
      description: 'Data Protection Regulation',
      validUntil: 'Ongoing'
    },
    {
      name: 'PCI DSS',
      icon: <FaCertificate />,
      description: 'Payment Card Security',
      validUntil: '2025-09-30'
    }
  ];

  const threatTypes = [
    { type: 'SQL Injection', severity: 'high' as const, icon: <FaDatabase /> },
    { type: 'XSS Attempt', severity: 'medium' as const, icon: <FaCode /> },
    { type: 'Brute Force', severity: 'low' as const, icon: <FaSkull /> },
    { type: 'DDoS Attack', severity: 'critical' as const, icon: <FaFireAlt /> },
    { type: 'Malware Upload', severity: 'high' as const, icon: <FaBug /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        const newThreat: ThreatIndicator = {
          id: Date.now().toString(),
          type: randomThreat.type,
          severity: randomThreat.severity,
          status: 'blocked',
          timestamp: new Date(),
          details: `Automated security system blocked ${randomThreat.type} attempt`
        };
        
        setThreats(prev => [newThreat, ...prev].slice(0, 10));
      }

      setSecurityScore(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.min(100, Math.max(85, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runSecurityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#ffc107';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FaCheckCircle style={{ color: '#4caf50' }} />;
      case 'monitoring': return <FaEye style={{ color: '#ffc107' }} />;
      case 'updating': return <FaExclamationTriangle style={{ color: '#ff9800' }} />;
      default: return null;
    }
  };

  return (
    <section className="security-showcase">
      <div className="container">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Enterprise Security
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Military-grade protection for your digital assets
          </motion.p>
        </div>

        <div className="security-nav">
          <button 
            className={activeView === 'overview' ? 'active' : ''}
            onClick={() => setActiveView('overview')}
          >
            <FaShieldAlt /> Overview
          </button>
          <button 
            className={activeView === 'features' ? 'active' : ''}
            onClick={() => setActiveView('features')}
          >
            <FaLock /> Features
          </button>
          <button 
            className={activeView === 'monitor' ? 'active' : ''}
            onClick={() => setActiveView('monitor')}
          >
            <FaEye /> Monitor
          </button>
          <button 
            className={activeView === 'audit' ? 'active' : ''}
            onClick={() => setActiveView('audit')}
          >
            <FaCertificate /> Compliance
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="view-content"
            >
              <div className="security-score-card">
                <div className="score-display">
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
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="#4caf50"
                        strokeWidth="10"
                        strokeDasharray={`${securityScore * 5.65} 565`}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                      />
                    </svg>
                    <div className="score-text">
                      <span className="score-number">{Math.round(securityScore)}</span>
                      <span className="score-label">Security Score</span>
                    </div>
                  </div>
                </div>
                <div className="score-details">
                  <h3>Overall Security Health</h3>
                  <div className="health-indicators">
                    <div className="indicator">
                      <FaCheckCircle style={{ color: '#4caf50' }} />
                      <span>All Systems Operational</span>
                    </div>
                    <div className="indicator">
                      <FaShieldAlt style={{ color: '#2196f3' }} />
                      <span>Zero Day Protection Active</span>
                    </div>
                    <div className="indicator">
                      <FaLock style={{ color: '#4caf50' }} />
                      <span>SSL/TLS Secured</span>
                    </div>
                  </div>
                  <button className="scan-btn" onClick={runSecurityScan} disabled={isScanning}>
                    {isScanning ? `Scanning... ${scanProgress}%` : 'Run Security Scan'}
                  </button>
                  {isScanning && (
                    <div className="scan-progress">
                      <div className="progress-bar" style={{ width: `${scanProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="certifications-grid">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    className="certification-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="cert-icon">{cert.icon}</div>
                    <h4>{cert.name}</h4>
                    <p>{cert.description}</p>
                    <span className="valid-until">Valid: {cert.validUntil}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="view-content"
            >
              <div className="features-grid">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    className="feature-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedFeature(feature)}
                  >
                    <div className="feature-header">
                      <div className="feature-icon">{feature.icon}</div>
                      <div className="feature-status">{getStatusIcon(feature.status)}</div>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <div className="feature-category">{feature.category}</div>
                    <div className="strength-meter">
                      <span className="strength-label">Strength</span>
                      <div className="strength-bar">
                        <div 
                          className="strength-fill" 
                          style={{ 
                            width: `${feature.strength}%`,
                            background: feature.strength > 90 ? '#4caf50' : 
                                       feature.strength > 70 ? '#ffc107' : '#f44336'
                          }} 
                        />
                      </div>
                      <span className="strength-value">{feature.strength}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'monitor' && (
            <motion.div
              key="monitor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="view-content"
            >
              <div className="threat-monitor">
                <div className="monitor-header">
                  <h3>Real-Time Threat Detection</h3>
                  <div className="threat-stats">
                    <div className="stat">
                      <span className="stat-value">{threats.filter(t => t.status === 'blocked').length}</span>
                      <span className="stat-label">Blocked</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Active</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">100%</span>
                      <span className="stat-label">Uptime</span>
                    </div>
                  </div>
                </div>

                <div className="threat-list">
                  <AnimatePresence mode="wait">
                    {threats.map((threat) => (
                      <motion.div
                        key={threat.id}
                        className="threat-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <div 
                          className="threat-severity"
                          style={{ background: getSeverityColor(threat.severity) }}
                        >
                          {threat.severity}
                        </div>
                        <div className="threat-info">
                          <h4>{threat.type}</h4>
                          <p>{threat.details}</p>
                          <span className="threat-time">
                            {threat.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={`threat-status ${threat.status}`}>
                          {threat.status === 'blocked' ? <FaShieldAlt /> : <FaEye />}
                          {threat.status}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {threats.length === 0 && (
                    <div className="no-threats">
                      <FaCheckCircle style={{ fontSize: '48px', color: '#4caf50' }} />
                      <p>No active threats detected</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="view-content"
            >
              <div className="compliance-dashboard">
                <div className="compliance-overview">
                  <h3>Compliance Standards</h3>
                  <div className="standards-list">
                    <div className="standard-item">
                      <SiOwasp />
                      <div className="standard-info">
                        <h4>OWASP Top 10</h4>
                        <p>Protection against common web vulnerabilities</p>
                        <div className="compliance-status">
                          <FaCheckCircle /> Fully Compliant
                        </div>
                      </div>
                    </div>
                    <div className="standard-item">
                      <FaShieldAlt />
                      <div className="standard-info">
                        <h4>GDPR</h4>
                        <p>EU data protection and privacy regulation</p>
                        <div className="compliance-status">
                          <FaCheckCircle /> Fully Compliant
                        </div>
                      </div>
                    </div>
                    <div className="standard-item">
                      <FaLock />
                      <div className="standard-info">
                        <h4>CCPA</h4>
                        <p>California Consumer Privacy Act compliance</p>
                        <div className="compliance-status">
                          <FaCheckCircle /> Fully Compliant
                        </div>
                      </div>
                    </div>
                    <div className="standard-item">
                      <FaCertificate />
                      <div className="standard-info">
                        <h4>HIPAA</h4>
                        <p>Healthcare data protection standards</p>
                        <div className="compliance-status">
                          <FaCheckCircle /> Fully Compliant
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="audit-reports">
                  <h3>Recent Audit Reports</h3>
                  <div className="reports-list">
                    <div className="report-item">
                      <div className="report-icon"><FaCheckCircle style={{ color: '#4caf50' }} /></div>
                      <div className="report-info">
                        <h4>Q4 2024 Security Audit</h4>
                        <p>Passed with zero critical findings</p>
                        <span className="report-date">December 15, 2024</span>
                      </div>
                      <button className="download-btn">Download</button>
                    </div>
                    <div className="report-item">
                      <div className="report-icon"><FaCheckCircle style={{ color: '#4caf50' }} /></div>
                      <div className="report-info">
                        <h4>Annual Penetration Test</h4>
                        <p>All vulnerabilities remediated</p>
                        <span className="report-date">November 30, 2024</span>
                      </div>
                      <button className="download-btn">Download</button>
                    </div>
                    <div className="report-item">
                      <div className="report-icon"><FaCheckCircle style={{ color: '#4caf50' }} /></div>
                      <div className="report-info">
                        <h4>SOC 2 Type II Report</h4>
                        <p>Clean opinion from auditors</p>
                        <span className="report-date">October 15, 2024</span>
                      </div>
                      <button className="download-btn">Download</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedFeature && (
          <div className="feature-modal" onClick={() => setSelectedFeature(null)}>
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedFeature(null)}>×</button>
              <div className="modal-header">
                <div className="modal-icon">{selectedFeature.icon}</div>
                <div>
                  <h2>{selectedFeature.title}</h2>
                  <span className="modal-category">{selectedFeature.category}</span>
                </div>
              </div>
              <p className="modal-description">{selectedFeature.description}</p>
              <div className="modal-details">
                <div className="detail-item">
                  <span className="detail-label">Implementation</span>
                  <span className="detail-value">{selectedFeature.implementation}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`status-badge ${selectedFeature.status}`}>
                    {selectedFeature.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Security Strength</span>
                  <div className="strength-meter">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${selectedFeature.strength}%`,
                          background: selectedFeature.strength > 90 ? '#4caf50' : 
                                     selectedFeature.strength > 70 ? '#ffc107' : '#f44336'
                        }} 
                      />
                    </div>
                    <span className="strength-value">{selectedFeature.strength}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SecurityShowcase;