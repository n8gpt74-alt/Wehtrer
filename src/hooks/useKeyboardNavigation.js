import { useState, useEffect } from 'react';

/**
 * Хук для keyboard навигации по виджетам
 * @param {number} itemCount - Количество элементов для навигации
 * @returns {number} focusedIndex - Индекс текущего фокуса
 */
export const useKeyboardNavigation = (itemCount) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Пропускаем если фокус на input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }
      
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev + 1) % itemCount);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev - 1 + itemCount) % itemCount);
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            e.preventDefault();
            const element = document.querySelector(`[data-widget-index="${focusedIndex}"]`);
            element?.click();
          }
          break;
        case 'Escape':
          setFocusedIndex(-1);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [itemCount, focusedIndex]);
  
  return focusedIndex;
};

/**
 * Компонент-обёртка для keyboard-navigable grid
 */
export const KeyboardGrid = ({ children, className = '' }) => {
  const itemCount = Array.isArray(children) ? children.length : 1;
  const focusedIndex = useKeyboardNavigation(itemCount);
  
  return (
    <div 
      role="grid"
      aria-label="Виджеты погоды"
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <div
            key={index}
            role="gridcell"
            data-widget-index={index}
            tabIndex={index === focusedIndex ? 0 : -1}
            className={`transition-all outline-none ${
              index === focusedIndex 
                ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' 
                : ''
            }`}
          >
            {child}
          </div>
        ))
      ) : (
        children
      )}
    </div>
  );
};

export default useKeyboardNavigation;
