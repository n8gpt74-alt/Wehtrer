// Анимированные иконки погоды с CSS анимациями

const WeatherAnimation = ({ type, size = 80 }) => {
  // Предварительно вычисленные позиции для звёзд (чтобы избежать Math.random в render)
  const starPositions = [
    { left: 15, top: 20 }, { left: 75, top: 15 }, { left: 30, top: 65 },
    { left: 80, top: 70 }, { left: 50, top: 35 }
  ];
  // Предварительно вычисленные позиции для капель дождя
  const rainHeights = [10, 14, 9, 12, 11, 15];
  // Предварительно вычисленные размеры для снежинок
  const snowSizes = [10, 12, 9, 14, 11, 13, 10, 12];
  // Предварительно вычисленные параметры для тумана
  const fogParams = [
    { width: 60, left: 8, opacity: 0.5 },
    { width: 75, left: 12, opacity: 0.6 },
    { width: 55, left: 6, opacity: 0.4 },
    { width: 80, left: 10, opacity: 0.7 }
  ];
  
  const animations = {
    sunny: (
      <div className="relative" style={{ width: size, height: size }}>
        {/* Sun core */}
        <div 
          className="absolute inset-1/4 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 animate-pulse"
          style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)' }}
        />
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-yellow-400 rounded-full animate-spin"
            style={{
              width: '4px',
              height: `${size * 0.2}px`,
              left: '50%',
              top: '10%',
              transformOrigin: `center ${size * 0.4}px`,
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              animationDuration: '10s',
            }}
          />
        ))}
      </div>
    ),
    
    'clear-night': (
      <div className="relative" style={{ width: size, height: size }}>
        {/* Moon */}
        <div 
          className="absolute inset-[15%] rounded-full bg-gradient-to-br from-slate-200 to-slate-300"
          style={{ boxShadow: '0 0 20px rgba(203, 213, 225, 0.4)' }}
        >
          {/* Moon craters */}
          <div className="absolute w-3 h-3 bg-slate-400/30 rounded-full top-[20%] left-[30%]" />
          <div className="absolute w-2 h-2 bg-slate-400/30 rounded-full top-[50%] left-[50%]" />
          <div className="absolute w-4 h-4 bg-slate-400/20 rounded-full top-[60%] left-[20%]" />
        </div>
        {/* Stars */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${starPositions[i].left}%`,
              top: `${starPositions[i].top}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    ),
    
    'partly-cloudy': (
      <div className="relative" style={{ width: size, height: size }}>
        {/* Sun behind */}
        <div 
          className="absolute w-1/2 h-1/2 top-[5%] left-[50%] rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 animate-pulse"
        />
        {/* Cloud */}
        <div className="absolute bottom-[10%] left-[5%] w-[90%]">
          <div className="relative">
            <div className="absolute w-12 h-8 bg-slate-300 rounded-full -top-4 left-2 animate-float" />
            <div className="absolute w-16 h-10 bg-slate-200 rounded-full -top-6 left-6 animate-float" style={{ animationDelay: '0.5s' }} />
            <div className="w-full h-8 bg-slate-300 rounded-full animate-float" style={{ animationDelay: '0.25s' }} />
          </div>
        </div>
      </div>
    ),
    
    cloudy: (
      <div className="relative" style={{ width: size, height: size }}>
        {/* Back cloud */}
        <div className="absolute top-[15%] left-[10%] w-[70%] opacity-60">
          <div className="relative">
            <div className="absolute w-8 h-6 bg-slate-400 rounded-full -top-3 left-2 animate-float" />
            <div className="w-full h-6 bg-slate-400 rounded-full animate-float" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
        {/* Front cloud */}
        <div className="absolute bottom-[15%] left-[5%] w-[90%]">
          <div className="relative">
            <div className="absolute w-10 h-7 bg-slate-300 rounded-full -top-4 left-3 animate-float" />
            <div className="absolute w-14 h-9 bg-slate-200 rounded-full -top-5 left-8 animate-float" style={{ animationDelay: '0.5s' }} />
            <div className="w-full h-7 bg-slate-300 rounded-full animate-float" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    ),
    
    rain: (
      <div className="relative overflow-hidden" style={{ width: size, height: size }}>
        {/* Cloud */}
        <div className="absolute top-[10%] left-[10%] w-[80%]">
          <div className="relative">
            <div className="absolute w-8 h-6 bg-slate-500 rounded-full -top-3 left-2" />
            <div className="absolute w-12 h-8 bg-slate-400 rounded-full -top-4 left-6" />
            <div className="w-full h-6 bg-slate-500 rounded-full" />
          </div>
        </div>
        {/* Rain drops */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 bg-blue-400 rounded-full animate-rain"
            style={{
              height: `${rainHeights[i]}px`,
              left: `${15 + i * 14}%`,
              top: '50%',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    ),
    
    snow: (
      <div className="relative overflow-hidden" style={{ width: size, height: size }}>
        {/* Cloud */}
        <div className="absolute top-[10%] left-[10%] w-[80%]">
          <div className="relative">
            <div className="absolute w-8 h-6 bg-slate-400 rounded-full -top-3 left-2" />
            <div className="absolute w-12 h-8 bg-slate-300 rounded-full -top-4 left-6" />
            <div className="w-full h-6 bg-slate-400 rounded-full" />
          </div>
        </div>
        {/* Snowflakes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white animate-snow"
            style={{
              fontSize: `${snowSizes[i]}px`,
              left: `${10 + i * 11}%`,
              top: '45%',
              animationDelay: `${i * 0.3}s`,
            }}
          >
            *
          </div>
        ))}
      </div>
    ),
    
    thunderstorm: (
      <div className="relative overflow-hidden" style={{ width: size, height: size }}>
        {/* Dark cloud */}
        <div className="absolute top-[5%] left-[5%] w-[90%]">
          <div className="relative">
            <div className="absolute w-10 h-7 bg-slate-600 rounded-full -top-4 left-2" />
            <div className="absolute w-14 h-9 bg-slate-700 rounded-full -top-5 left-7" />
            <div className="w-full h-7 bg-slate-600 rounded-full" />
          </div>
        </div>
        {/* Lightning */}
        <svg 
          className="absolute top-[40%] left-[35%] w-[30%] h-[45%] animate-lightning"
          viewBox="0 0 24 36"
        >
          <path
            d="M13 0L4 14h6l-4 12 11-16h-6z"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
          />
        </svg>
        {/* Rain */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-2 bg-blue-400 rounded-full animate-rain"
            style={{
              left: `${20 + i * 18}%`,
              top: '55%',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    ),
    
    fog: (
      <div className="relative" style={{ width: size, height: size }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute h-2 bg-slate-400 rounded-full animate-fog"
            style={{
              width: `${fogParams[i].width}%`,
              left: `${fogParams[i].left}%`,
              top: `${20 + i * 20}%`,
              opacity: fogParams[i].opacity,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    ),
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {animations[type] || animations.cloudy}
    </div>
  );
};

export default WeatherAnimation;
