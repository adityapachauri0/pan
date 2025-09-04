import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaPlay, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section style={{
      position: 'relative',
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              marginBottom: '30px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <FaRocket style={{ color: 'white', fontSize: '16px' }} />
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
              Leading Web Development Studio
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '54px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}
          >
            Building <span style={{
              background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Digital Excellence</span>
            <br />
            for Modern Businesses
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}
          >
            Transform your digital presence with cutting-edge web solutions.
            We craft beautiful, performant websites that drive results and elevate your brand.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '60px'
            }}
          >
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px 28px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#667eea',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }}
              >
                Start Your Project
                <FaArrowRight />
              </motion.button>
            </Link>
            
            <Link to="/portfolio">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px 28px',
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <FaPlay />
                Watch Demo
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex',
              gap: '40px'
            }}
          >
            {[
              { value: '150+', label: 'Projects Delivered' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '10+', label: 'Years Experience' }
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            position: 'relative',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Animated Card Stack */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Card 3 - Back */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 0.4
              }}
              style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '60%',
                height: '60%',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transform: 'rotate(-5deg)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
            />
            
            {/* Card 2 - Middle */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, -1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 0.2
              }}
              style={{
                position: 'absolute',
                top: '15%',
                left: '15%',
                width: '60%',
                height: '60%',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transform: 'rotate(3deg)',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)'
              }}
            />
            
            {/* Card 1 - Front */}
            <motion.div
              animate={{
                y: [0, -20, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '60%',
                height: '60%',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                background: 'white',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaRocket style={{ fontSize: '40px', color: '#667eea' }} />
              </div>
              <h3 style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                Panchroma
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                Excellence in Digital Innovation
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;