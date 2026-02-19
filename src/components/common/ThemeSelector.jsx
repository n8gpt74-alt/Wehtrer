import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

const themes = {
  ocean: {
    name: 'Океан',
    primary: 'from-blue-500 to-cyan-500',
    bg: 'bg-slate-900',
    accent: 'text-cyan-400',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)',
    preview: 'bg-gradient-to-br from-blue-600 to-cyan-500',
  },
  sunset: {
    name: 'Закат',
    primary: 'from-orange-500 to-pink-500',
    bg: 'bg-slate-900',
    accent: 'text-orange-400',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #0f172a 100%)',
    preview: 'bg-gradient-to-br from-orange-600 to-pink-500',
  },
  forest: {
    name: 'Лес',
    primary: 'from-green-500 to-emerald-500',
    bg: 'bg-slate-900',
    accent: 'text-green-400',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
    preview: 'bg-gradient-to-br from-green-600 to-emerald-500',
  },
  midnight: {
    name: 'Полночь',
    primary: 'from-purple-500 to-indigo-500',
    bg: 'bg-slate-900',
    accent: 'text-purple-400',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
    preview: 'bg-gradient-to-br from-purple-600 to-indigo-500',
  },
  arctic: {
    name: 'Арктика',
    primary: 'from-cyan-400 to-blue-400',
    bg: 'bg-slate-800',
    accent: 'text-cyan-300',
    gradient: 'linear-gradient(135deg, #164e63 0%, #1e293b 100%)',
    preview: 'bg-gradient-to-br from-cyan-400 to-blue-300',
  },
  fire: {
    name: 'Огонь',
    primary: 'from-red-500 to-orange-500',
    bg: 'bg-slate-900',
    accent: 'text-red-400',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #0f172a 100%)',
    preview: 'bg-gradient-to-br from-red-600 to-orange-500',
  },
};

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState('ocean');
  const [isOpen, setIsOpen] = useState(false);

  // Загрузка сохранённой темы
  useEffect(() => {
    const saved = localStorage.getItem('weather_theme');
    if (saved && themes[saved]) {
      setCurrentTheme(saved);
      applyTheme(saved);
    }
  }, []);

  // Применение темы
  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    // Применяем CSS переменные
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-bg', theme.bg);
    root.style.setProperty('--theme-accent', theme.accent);
    
    // Сохраняем
    localStorage.setItem('weather_theme', themeName);
    setCurrentTheme(themeName);
  };

  const handleSelect = (themeName) => {
    applyTheme(themeName);
    setIsOpen(false);
  };

  return (
    <>
      {/* Кнопка открытия */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        title="Выбрать тему"
      >
        <Palette className="w-5 h-5 text-slate-300" />
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <>
          {/* Затемнение */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Панель тем */}
          <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 w-72 animate-fade-in-up">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Тема оформления
              </h3>
            </div>
            
            <div className="p-3 grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`relative p-3 rounded-lg border transition-all card-hover ${
                    currentTheme === key
                      ? 'border-blue-500 bg-slate-700'
                      : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  {/* Превью */}
                  <div className={`h-12 rounded-lg ${theme.preview} mb-2`} />
                  
                  {/* Название */}
                  <div className="text-sm font-medium text-slate-100">
                    {theme.name}
                  </div>
                  
                  {/* Индикатор выбора */}
                  {currentTheme === key && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Информация */}
            <div className="p-3 border-t border-slate-700 text-xs text-slate-400 text-center">
              Тема сохраняется автоматически
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ThemeSelector;
