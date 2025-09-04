import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaHandshake, FaAward, FaRocket, FaChartLine, FaCode, FaHeart } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '120px 20px 80px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '20px'
            }}>
              About <span style={{
                background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Panchroma</span>
            </h1>
            <p style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '300'
            }}>
              Building digital excellence since 2014
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section style={{
        padding: '100px 20px',
        background: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '30px'
            }}>
              We're a team of <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>passionate digital creators</span>
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#718096',
              lineHeight: '1.8',
              marginBottom: '20px'
            }}>
              At Panchroma, we believe in the power of great design and cutting-edge technology 
              to transform businesses. Our team of expert developers, designers, and strategists 
              work together to create digital experiences that not only look beautiful but also 
              drive real results.
            </p>
            <p style={{
              fontSize: '18px',
              color: '#718096',
              lineHeight: '1.8'
            }}>
              With over 10 years of experience in the industry, we've helped hundreds of businesses 
              establish their online presence and achieve their digital goals. From startups to 
              established enterprises, we tailor our solutions to meet your unique needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            {[
              { value: '500+', label: 'Projects Completed', color: '#667eea' },
              { value: '200+', label: 'Happy Clients', color: '#764ba2' },
              { value: '10+', label: 'Years Experience', color: '#ec4899' },
              { value: '98%', label: 'Client Satisfaction', color: '#10b981' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: '30px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
                }}
              >
                <h3 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: stat.color,
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#718096',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f4f8 100%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              marginBottom: '60px'
            }}
          >
            <h2 style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '20px'
            }}>
              Our Core <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Values</span>
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#718096',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              The principles that guide everything we do
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px'
          }}>
            {[
              { 
                icon: FaUsers, 
                title: 'Client-Focused', 
                desc: 'Your success is our priority. We listen, understand, and deliver solutions that exceed expectations.',
                color: '#667eea'
              },
              { 
                icon: FaLightbulb, 
                title: 'Innovation', 
                desc: 'Always pushing boundaries with creative solutions and the latest technologies.',
                color: '#764ba2'
              },
              { 
                icon: FaHandshake, 
                title: 'Partnership', 
                desc: 'We grow together. Building long-term relationships based on trust and mutual success.',
                color: '#ec4899'
              },
              { 
                icon: FaAward, 
                title: 'Excellence', 
                desc: 'Quality in everything we do. From code to design, we maintain the highest standards.',
                color: '#10b981'
              },
              { 
                icon: FaHeart, 
                title: 'Passion', 
                desc: 'We love what we do and it shows in our work. Every project is a chance to create something amazing.',
                color: '#f59e0b'
              },
              { 
                icon: FaRocket, 
                title: 'Growth', 
                desc: 'Continuous learning and improvement. We evolve with technology to deliver cutting-edge solutions.',
                color: '#ef4444'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '40px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
                  background: `linear-gradient(135deg, ${value.color}22 0%, ${value.color}11 100%)`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <value.icon style={{
                    fontSize: '36px',
                    color: value.color
                  }} />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a202c',
                  marginBottom: '12px'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#718096',
                  lineHeight: '1.6'
                }}>
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <h2 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '20px'
          }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '40px'
          }}>
            Let's work together to bring your ideas to life
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/contact'}
            style={{
              padding: '16px 40px',
              background: 'white',
              border: 'none',
              borderRadius: '10px',
              color: '#667eea',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}
          >
            Get in Touch
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;