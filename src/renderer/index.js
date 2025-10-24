// Import React core libraries
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element from index.html
const rootElement = document.getElementById('root');

// Create a React root (this is the new React 18 way)
const root = ReactDOM.createRoot(rootElement);

// Render our App component into the root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Log to console (you'll see this in DevTools)
console.log('React app loaded successfully!');