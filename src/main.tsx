import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import App from '@/App';
import '@/assets/styles/index.css';
import '@/assets/styles/darkTheme.css';

// Add Font Awesome script to the document
const fontAwesomeScript = document.createElement('script');
fontAwesomeScript.src = 'https://kit.fontawesome.com/a076d05399.js';
fontAwesomeScript.crossOrigin = 'anonymous';
document.head.appendChild(fontAwesomeScript);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
); 