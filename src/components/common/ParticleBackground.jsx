import { useEffect, useState } from 'react';

const ParticleBackground = ({ weatherType = 'clear' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles based on weather type
    const particleCount = weatherType === 'snow' ? 50 : weatherType === 'rain' ? 30 : 15;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 10,
        size: 2 + Math.random() * 4,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }

    setParticles(newParticles);
  }, [weatherType]);

  const getParticleColor = () => {
    switch (weatherType) {
      case 'snow':
        return 'rgba(255, 255, 255, 0.8)';
      case 'rain':
        return 'rgba(96, 165, 250, 0.6)';
      case 'sunny':
        return 'rgba(251, 191, 36, 0.4)';
      default:
        return 'rgba(148, 163, 184, 0.3)';
    }
  };

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            bottom: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: getParticleColor(),
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
