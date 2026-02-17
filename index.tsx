import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  console.error("Critical: Root element not found");
} else {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Fatal: React Render Failure", error);
    container.innerHTML = `<div style="padding: 20px; color: white;">Application failed to start. Please refresh.</div>`;
  }
}