import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaHandshake, FaAward } from 'react-icons/fa';
import './Pages.css';

const AboutPage: React.FC = () => {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About <span className="gradient-text">Panchroma</span></h1>
            <p>Building digital excellence since 2014</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-content">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>We're a team of passionate digital creators</h2>
              <p>
                At Panchroma, we believe in the power of great design and cutting-edge technology 
                to transform businesses. Our team of expert developers, designers, and strategists 
                work together to create digital experiences that not only look beautiful but also 
                drive real results.
              </p>
              <p>
                With over 10 years of experience in the industry, we've helped hundreds of businesses 
                establish their online presence and achieve their digital goals. From startups to 
                established enterprises, we tailor our solutions to meet your unique needs.
              </p>
            </motion.div>

            <div className="values-grid">
              {[
                { icon: <FaUsers />, title: 'Client-Focused', desc: 'Your success is our priority' },
                { icon: <FaLightbulb />, title: 'Innovation', desc: 'Always pushing boundaries' },
                { icon: <FaHandshake />, title: 'Partnership', desc: 'We grow together' },
                { icon: <FaAward />, title: 'Excellence', desc: 'Quality in everything we do' }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="value-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;