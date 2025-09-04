import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx = -particle.vx;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy = -particle.vy;
        }
        
        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
        ctx.fill();
        
        // Connect particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const particle2 = particlesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(particle.x - particle2.x, 2) +
            Math.pow(particle.y - particle2.y, 2)
          );
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
        // Connect to mouse
        const mouseDistance = Math.sqrt(
          Math.pow(particle.x - mouseRef.current.x, 2) +
          Math.pow(particle.y - mouseRef.current.y, 2)
        );
        
        if (mouseDistance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(118, 75, 162, ${0.3 * (1 - mouseDistance / 100)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Attract particle to mouse slightly
          const attractionForce = 0.02;
          particle.vx += (mouseRef.current.x - particle.x) * attractionForce * 0.01;
          particle.vy += (mouseRef.current.y - particle.y) * attractionForce * 0.01;
          
          // Limit velocity
          const maxVelocity = 2;
          particle.vx = Math.max(-maxVelocity, Math.min(maxVelocity, particle.vx));
          particle.vy = Math.max(-maxVelocity, Math.min(maxVelocity, particle.vy));
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.6
      }}
    />
  );
};

export default ParticleNetwork;