import { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';

const ExportWidget = ({ weatherData, location }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Создание карточки для экспорта
  const createExportCard = () => {
    if (!weatherData || !weatherData.current) return null;

    const current = weatherData.current;
    const date = new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div
        id="weather-export-card"
        className="hidden"
        style={{
          width: '400px',
          padding: '24px',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          borderRadius: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#e2e8f0',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {location?.city || 'Погода'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.7 }}>
              {location?.country}
            </p>
          </div>
          <div style={{ fontSize: '48px' }}>
            {getWeatherIcon(current.condition?.code)}
          </div>
        </div>

        {/* Temperature */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '56px', fontWeight: 'bold', lineHeight: 1 }}>
            {Math.round(current.temperature)}°C
          </div>
          <div style={{ fontSize: '16px', opacity: 0.8, marginTop: '4px' }}>
            {current.condition?.label} • Ощущается как {Math.round(current.feelsLike)}°C
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <StatBox label="Влажность" value={`${current.humidity}%`} icon="💧" />
          <StatBox label="Ветер" value={`${Math.round(current.windSpeed)} м/с`} icon="💨" />
          <StatBox label="Давление" value={`${Math.round(current.pressure * 0.75)} мм`} icon="📊" />
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', fontSize: '12px', opacity: 0.6 }}>
          {date} • Метеостанция
        </div>
      </div>
    );
  };

  const getWeatherIcon = (code) => {
    const icons = {
      sunny: '☀️',
      'clear-night': '🌙',
      'partly-cloudy': '⛅',
      cloudy: '☁️',
      rain: '🌧️',
      snow: '❄️',
      thunderstorm: '⛈️',
      mist: '🌫️',
      drizzle: '🌦️',
    };
    return icons[code] || '🌤️';
  };

  const StatBox = ({ label, value, icon }) => (
    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
      <div style={{ fontSize: '16px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: '600' }}>{value}</div>
    </div>
  );

  // Экспорт в PNG
  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Показываем карточку
      const card = document.getElementById('weather-export-card');
      if (card) {
        card.classList.remove('hidden');

        // Генерируем PNG
        const dataUrl = await toPng(card, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#1e3a5f',
        });

        // Скачиваем файл
        const link = document.createElement('a');
        link.download = `weather-${location?.city || 'forecast'}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        // Скрываем карточку
        card.classList.add('hidden');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Не удалось создать изображение. Попробуйте скриншот.');
    } finally {
      setIsExporting(false);
    }
  };

  // Поделиться
  const handleShare = async () => {
    if (!navigator.share) {
      handleExport();
      return;
    }

    try {
      const card = document.getElementById('weather-export-card');
      if (!card) return;

      card.classList.remove('hidden');

      const blob = await toPng(card, { quality: 0.9, pixelRatio: 2 })
        .then(dataUrl => fetch(dataUrl))
        .then(res => res.blob());

      card.classList.add('hidden');

      await navigator.share({
        title: `Погода • ${location?.city}`,
        text: `Текущая погода: ${Math.round(weatherData.current.temperature)}°C`,
        files: [new File([blob], 'weather.png', { type: 'image/png' })],
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        handleExport();
      }
    }
  };

  return (
    <>
      {createExportCard()}
      
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          disabled={isExporting || !weatherData}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed button-press"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Экспорт...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Скачать PNG</span>
            </>
          )}
        </button>

        {navigator.share && (
          <button
            onClick={handleShare}
            disabled={isExporting || !weatherData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed button-press"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Поделиться</span>
          </button>
        )}
      </div>
    </>
  );
};

export default ExportWidget;
