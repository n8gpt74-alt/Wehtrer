/**
 * Skip Link Component
 * Позволяет пользователям screen reader пропустить навигацию
 */
const SkipLink = () => (
  <a 
    href="#main-content" 
    className="skip-link"
  >
    Перейти к основному контенту
  </a>
);

export default SkipLink;
