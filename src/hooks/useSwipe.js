import { useRef } from 'react';

/**
 * Хук для swipe жестов
 * @param {Object} callbacks - Функции для различных swipe направлений
 * @param {number} threshold - Минимальное расстояние для распознавания swipe (px)
 */
export const useSwipe = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown, 
  threshold = 50 
}) => {
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  
  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };
  
  const onTouchMove = (e) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };
  
  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    
    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);
    
    // Проверка горизонтального свайпа
    if (isHorizontal) {
      if (distanceX > threshold && onSwipeLeft) {
        onSwipeLeft();
      } else if (distanceX < -threshold && onSwipeRight) {
        onSwipeRight();
      }
    } 
    // Проверка вертикального свайпа
    else {
      if (distanceY > threshold && onSwipeUp) {
        onSwipeUp();
      } else if (distanceY < -threshold && onSwipeDown) {
        onSwipeDown();
      }
    }
  };
  
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

/**
 * Компонент-обёртка для swipeable виджетов
 */
export const SwipeableWidget = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = ''
}) => {
  const gestures = useSwipe({ 
    onSwipeLeft, 
    onSwipeRight, 
    onSwipeUp, 
    onSwipeDown, 
    threshold 
  });
  
  return (
    <div 
      {...gestures}
      className={`touch-pan-y ${className}`}
      role="region"
      aria-label="Swipeable widget"
    >
      {children}
    </div>
  );
};

export default useSwipe;
