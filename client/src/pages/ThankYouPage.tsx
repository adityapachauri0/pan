import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaEnvelope, FaClock } from 'react-icons/fa';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '600px',
          width: '100%',
          background: 'white',
          borderRadius: '24px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 30px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaCheckCircle style={{
            fontSize: '50px',
            color: 'white'
          }} />
        </motion.div>

        {/* Thank You Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '42px',
            fontWeight: '800',
            color: '#1a202c',
            marginBottom: '20px'
          }}
        >
          Thank You!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '20px',
            color: '#4a5568',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}
        >
          Your message has been successfully sent. We appreciate you reaching out to us!
        </motion.p>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f4f8 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'left'
          }}>
            <FaClock style={{
              fontSize: '24px',
              color: '#667eea',
              flexShrink: 0
            }} />
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '4px'
              }}>
                Response Time
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                margin: 0
              }}>
                We typically respond within 24 business hours
              </p>
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f4f8 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'left'
          }}>
            <FaEnvelope style={{
              fontSize: '24px',
              color: '#764ba2',
              flexShrink: 0
            }} />
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '4px'
              }}>
                Check Your Email
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                margin: 0
              }}>
                You'll receive a confirmation email shortly
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}
          >
            <FaHome /> Back to Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/portfolio')}
            style={{
              padding: '14px 32px',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              color: '#4a5568',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            View Portfolio
          </motion.button>
        </motion.div>

        {/* Auto Redirect Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            fontSize: '13px',
            color: '#a0aec0',
            marginTop: '30px',
            fontStyle: 'italic'
          }}
        >
          You'll be redirected to the homepage in 10 seconds...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;