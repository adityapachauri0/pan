import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaPlay, FaRocket } from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="container">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FaRocket />
              <span>Leading Web Development Studio</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Building <span className="gradient-text">Digital Excellence</span>
              <br />
              for Modern Businesses
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Transform your digital presence with cutting-edge web solutions.
              We craft beautiful, performant websites that drive results and elevate your brand.
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="btn btn-primary">
                Start Your Project
                <FaArrowRight />
              </button>
              <button className="btn btn-secondary">
                <FaPlay />
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="stat">
                <h3>150+</h3>
                <p>Projects Delivered</p>
              </div>
              <div className="stat">
                <h3>98%</h3>
                <p>Client Satisfaction</p>
              </div>
              <div className="stat">
                <h3>10+</h3>
                <p>Years Experience</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1000}
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.02}
            >
              <div className="hero-card">
                <div className="hero-card-content">
                  <div className="code-window">
                    <div className="window-header">
                      <div className="window-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                      </div>
                      <span className="window-title">panchroma.ca</span>
                    </div>
                    <div className="window-content">
                      <pre>
                        <code>
{`const panchroma = {
  services: ['Web Design', 'Development', 'SEO'],
  tech: ['React', 'Node.js', 'MongoDB'],
  passion: 'Creating Digital Excellence',
  
  buildYourVision: () => {
    return 'Success';
  }
};`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="hero-card-glow"></div>
              </div>
            </Tilt>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Hero;