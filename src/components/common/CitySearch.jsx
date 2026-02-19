import { useState, useEffect, useCallback } from 'react';
import { Search, Star, MapPin, X, Clock } from 'lucide-react';
import { weatherService } from '../../services/weatherService';

const CitySearch = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  // Загрузка избранных и недавних
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorite_cities');
    const savedRecent = localStorage.getItem('recent_searches');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecent) {
      setRecentSearches(JSON.parse(savedRecent));
    }
  }, []);

  // Поиск городов
  const searchCities = useCallback(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const cities = await weatherService.searchCity(searchQuery);
      setResults(cities);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchCities(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchCities]);

  // Выбор города
  const handleSelect = (city) => {
    onCitySelect(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);

    // Добавление в недавние
    const updatedRecent = [
      { ...city, searchedAt: Date.now() },
      ...recentSearches.filter(r => r.name !== city.name)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecent);
    localStorage.setItem('recent_searches', JSON.stringify(updatedRecent));
  };

  // Добавление/удаление из избранного
  const toggleFavorite = (city, e) => {
    e.stopPropagation();
    
    const exists = favorites.find(f => f.name === city.name);
    let updated;
    
    if (exists) {
      updated = favorites.filter(f => f.name !== city.name);
    } else {
      updated = [...favorites, { ...city, addedAt: Date.now() }];
    }
    
    setFavorites(updated);
    localStorage.setItem('favorite_cities', JSON.stringify(updated));
  };

  // Удаление из недавних
  const removeRecent = (cityName, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => r.name !== cityName);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  // Удаление из избранного
  const removeFavorite = (cityName, e) => {
    e.stopPropagation();
    const updated = favorites.filter(f => f.name !== cityName);
    setFavorites(updated);
    localStorage.setItem('favorite_cities', JSON.stringify(updated));
  };

  return (
    <div className="relative">
      {/* Поле поиска */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <label htmlFor="city-search-input" className="sr-only">Поиск города</label>
        <input
          id="city-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Поиск города..."
          className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-300 rounded-lg transition-colors"
            aria-label="Очистить поиск"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <>
          {/* Затемнение фона */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fade-in-up">
            {/* Избранные города */}
            {!query && favorites.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-2">
                  <Star className="w-3 h-3 inline mr-1 text-yellow-400" /> Избранные
                </div>
                {favorites.map((city) => (
                  <div
                    key={`fav-${city.name}`}
                    className="w-full flex items-center justify-between gap-2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <button
                      onClick={() => handleSelect(city)}
                      className="flex-1 min-w-0 flex items-center gap-3 text-left"
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <div className="text-left min-w-0">
                        <div className="text-sm font-medium text-slate-100 truncate">{city.name}</div>
                        <div className="text-xs text-slate-400 truncate">{city.country}</div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => removeFavorite(city.name, e)}
                      className="p-2 min-h-[44px] min-w-[44px] text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                      aria-label={`Удалить ${city.name} из избранного`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Недавние поиски */}
            {!query && recentSearches.length > 0 && favorites.length > 0 && (
              <div className="border-t border-slate-700" />
            )}
            
            {!query && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-2">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Недавние
                </div>
                {recentSearches.map((city) => (
                  <div
                    key={`recent-${city.name}`}
                    className="w-full flex items-center justify-between gap-2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <button
                      onClick={() => handleSelect(city)}
                      className="flex-1 min-w-0 flex items-center gap-3 text-left"
                    >
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div className="text-left min-w-0">
                        <div className="text-sm font-medium text-slate-100 truncate">{city.name}</div>
                        <div className="text-xs text-slate-400 truncate">{city.country}</div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => removeRecent(city.name, e)}
                      className="p-2 min-h-[44px] min-w-[44px] text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                      aria-label={`Удалить ${city.name} из недавних`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Результаты поиска */}
            {query && isLoading && (
              <div className="p-4 text-center text-slate-400">
                <div className="animate-spin-slow inline-block">
                  <Search className="w-6 h-6" />
                </div>
                <p className="mt-2 text-sm">Поиск...</p>
              </div>
            )}

            {query && !isLoading && results.length === 0 && (
              <div className="p-4 text-center text-slate-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Города не найдены</p>
              </div>
            )}

            {query && !isLoading && results.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-2">
                  <MapPin className="w-3 h-3 inline mr-1 text-blue-400" /> Результаты
                </div>
                {results.map((city, index) => {
                  const isFavorite = favorites.some(f => f.name === city.name);
                  return (
                    <div
                      key={`result-${city.name}-${index}`}
                      className="w-full flex items-center justify-between gap-2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <button
                        onClick={() => handleSelect(city)}
                        className="flex-1 min-w-0 flex items-center gap-3 text-left"
                      >
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <div className="text-left min-w-0">
                          <div className="text-sm font-medium text-slate-100 truncate">
                            {city.name}
                            {city.state && `, ${city.state}`}
                          </div>
                          <div className="text-xs text-slate-400 truncate">{city.country}</div>
                        </div>
                      </button>
                      <button
                        onClick={(e) => toggleFavorite(city, e)}
                        className={`p-2 min-h-[44px] min-w-[44px] rounded-lg transition-colors ${
                          isFavorite
                            ? 'text-yellow-400'
                            : 'text-slate-400 hover:text-yellow-400'
                        }`}
                        aria-label={isFavorite ? `Удалить ${city.name} из избранного` : `Добавить ${city.name} в избранное`}
                      >
                        <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Кнопка закрытия */}
            <div className="p-2 border-t border-slate-700">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CitySearch;
