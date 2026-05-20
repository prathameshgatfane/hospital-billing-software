import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🛠️ SELF-HEALING: Clear stale/invalid tokens from other apps
const checkStaleTokens = () => {
  const keys = ['clientToken', 'staffToken', 'adminToken'];
  keys.forEach(key => {
    const token = localStorage.getItem(key);
    // If token looks like it's from the other app (has "role" in payload)
    if (token && token.includes('eyJ')) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'principal') {
          console.log(`🛠️ Self-Heal: Removing stale ${key}`);
          localStorage.removeItem(key);
          localStorage.removeItem('tenantId');
          window.location.reload();
        }
      } catch (e) {}
    }
  });
};
checkStaleTokens();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
