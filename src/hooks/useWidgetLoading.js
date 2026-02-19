import { useState, useEffect } from 'react';

/**
 * Хук для управления состоянием загрузки виджета
 * @param {number} delay - Задержка перед показом контента (мс)
 * @returns {boolean} isLoading
 */
export const useWidgetLoading = (delay = 300) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isLoading;
};

export default useWidgetLoading;
