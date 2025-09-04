import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5010'}/api/auth/login`, {
        username: email, // Backend accepts username, but we can send email as username
        password
      });
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        toast.success(response.data.message || 'Login successful!');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          margin: '0 auto'
        }}
      >
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Logo & Title - Centered and Clean */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: 'center', marginBottom: '35px' }}
          >
            <div 
              style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
              }}
            >
              <FaSignInAlt style={{ fontSize: '32px', color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              Welcome Back
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#718096',
              fontWeight: '400'
            }}>
              Sign in to access your dashboard
            </p>
          </motion.div>

          {/* Form - Clean and Well Spaced */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '25px' }}>
            {/* Email Field */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: '20px' }}
            >
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '8px',
                letterSpacing: '0.025em'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '18px',
                  color: '#a0aec0'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 44px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    backgroundColor: 'white',
                    color: '#2d3748',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ marginBottom: '20px' }}
            >
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '8px',
                letterSpacing: '0.025em'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '18px',
                  color: '#a0aec0'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 44px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    backgroundColor: 'white',
                    color: '#2d3748',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    fontSize: '18px',
                    color: '#a0aec0',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#667eea'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* Remember & Forgot - Clean Alignment */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}
            >
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                color: '#4a5568',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    marginRight: '8px',
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                Remember me
              </label>
              <Link 
                to="/forgot-password" 
                style={{
                  fontSize: '14px',
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Sign In Button - Clean and Modern */}
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '13px',
                background: isLoading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                letterSpacing: '0.025em'
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg 
                    className="animate-spin" 
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '8px',
                      animation: 'spin 1s linear infinite'
                    }}
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      cx="12" cy="12" r="10" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="none" 
                      opacity="0.25"
                    />
                    <path 
                      fill="currentColor" 
                      opacity="0.75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link - Clean and Centered */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <p style={{
              fontSize: '14px',
              color: '#718096'
            }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
              >
                Sign up
              </Link>
            </p>
          </motion.div>

          {/* Demo Credentials - Clean Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              marginTop: '30px',
              padding: '16px',
              background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f4f8 100%)',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}
          >
            <p style={{
              fontSize: '12px',
              color: '#a0aec0',
              textAlign: 'center',
              marginBottom: '8px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Demo Credentials
            </p>
            <p style={{
              fontSize: '14px',
              color: '#4a5568',
              textAlign: 'center',
              marginBottom: '4px'
            }}>
              <strong>Email:</strong> admin@panchroma.com
            </p>
            <p style={{
              fontSize: '14px',
              color: '#4a5568',
              textAlign: 'center'
            }}>
              <strong>Password:</strong> admin123
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Add spinning animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;