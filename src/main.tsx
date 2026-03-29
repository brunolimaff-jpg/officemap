import React from 'react';
import ReactDOM from 'react-dom/client';
import BoardRoomClient from './components/BoardRoomClient';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BoardRoomClient />
    </ErrorBoundary>
  </React.StrictMode>
);
