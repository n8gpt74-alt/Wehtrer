import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import './index.css';

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return <Dashboard isDark={isDark} toggleTheme={toggleTheme} />;
}

export default App;
