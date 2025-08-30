import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    text: 'Panchroma transformed our online presence completely. Their attention to detail and technical expertise is unmatched. Our new website has increased conversions by 150%.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Founder, E-Shop Plus',
    avatar: 'https://i.pravatar.cc/150?img=2',
    rating: 5,
    text: 'Working with Panchroma was a game-changer for our business. They delivered a beautiful, fast, and user-friendly e-commerce platform that exceeded all our expectations.'
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Marketing Director, Innovate Corp',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    text: 'The team at Panchroma is incredibly talented and professional. They took our complex requirements and created a stunning website that perfectly represents our brand.'
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'CTO, DataFlow Systems',
    avatar: 'https://i.pravatar.cc/150?img=4',
    rating: 5,
    text: 'Outstanding technical skills and excellent communication throughout the project. Panchroma delivered our web application on time and within budget.'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="testimonials section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Testimonials</span>
          <h2>What Our <span className="gradient-text">Clients Say</span></h2>
          <p>Don't just take our word for it - hear from our satisfied clients</p>
        </motion.div>

        <motion.div
          className="testimonials-slider"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="testimonial-card">
                  <FaQuoteLeft className="quote-icon" />
                  
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="star" />
                    ))}
                  </div>

                  <p className="testimonial-text">{testimonial.text}</p>

                  <div className="testimonial-author">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                    <div>
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;