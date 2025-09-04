import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO, TechStart',
      content: 'Panchroma transformed our online presence completely. Their attention to detail and innovative solutions exceeded our expectations. Highly recommended!',
      rating: 5,
      image: 'https://i.pravatar.cc/100?img=1'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Founder, E-Shop Plus',
      content: 'Working with Panchroma was a game-changer for our business. They delivered a stunning website that increased our conversions by 150%.',
      rating: 5,
      image: 'https://i.pravatar.cc/100?img=2'
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Marketing Director, Innovate Co',
      content: 'The team at Panchroma is incredibly professional and talented. They understood our vision and brought it to life beautifully.',
      rating: 5,
      image: 'https://i.pravatar.cc/100?img=3'
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'CTO, DataFlow Systems',
      content: 'Outstanding technical skills and excellent communication. Panchroma delivered our web application on time and within budget.',
      rating: 5,
      image: 'https://i.pravatar.cc/100?img=4'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      role: 'Product Manager, NextGen Tech',
      content: 'Panchroma\'s expertise in modern web technologies helped us create a platform that our users love. Exceptional work!',
      rating: 5,
      image: 'https://i.pravatar.cc/100?img=5'
    },
    {
      id: 6,
      name: 'James Miller',
      role: 'Owner, Creative Agency',
      content: 'We\'ve partnered with Panchroma on multiple projects. Their consistency and quality of work is unmatched in the industry.',
      rating: 5,
      image: 'https://i.pravatar.cc/100?img=6'
    }
  ];

  return (
    <section style={{
      padding: '100px 20px',
      background: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            marginBottom: '80px'
          }}
        >
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#1a202c',
            marginBottom: '20px'
          }}>
            Client <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Testimonials</span>
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#718096',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Don't just take our word for it - hear what our clients have to say about working with us
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '40px'
        }}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              style={{
                background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f4f8 100%)',
                borderRadius: '20px',
                padding: '40px',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Quote Icon */}
              <FaQuoteLeft style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '40px',
                color: '#667eea',
                opacity: 0.1
              }} />

              {/* Stars */}
              <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '20px'
              }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} style={{
                    color: '#f59e0b',
                    fontSize: '20px'
                  }} />
                ))}
              </div>

              {/* Content */}
              <p style={{
                fontSize: '18px',
                color: '#4a5568',
                lineHeight: '1.6',
                marginBottom: '30px',
                fontStyle: 'italic',
                minHeight: '100px'
              }}>
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '20px'
              }}>
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid white',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <div>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1a202c',
                    marginBottom: '4px'
                  }}>
                    {testimonial.name}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#718096'
                  }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            marginTop: '80px',
            textAlign: 'center',
            padding: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '24px'
          }}
        >
          <h3 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '40px'
          }}>
            Trusted by Industry Leaders
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '60px',
            flexWrap: 'wrap'
          }}>
            {[
              { value: '500+', label: 'Happy Clients' },
              { value: '98%', label: 'Satisfaction Rate' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <h4 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;