'use client';

import React, { useState, useEffect } from 'react';
import ErrorReportModal from './ErrorReportModal';

export default function ErrorReportClient() {
  const [showModal, setShowModal] = useState(false);
  const [reportedGame, setReportedGame] = useState(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const gameData = sessionStorage.getItem('lastDownloadedGame');
        if (gameData) {
          try {
            setReportedGame(JSON.parse(gameData));
            // Add a slight delay so it's not too jarring when returning
            setTimeout(() => setShowModal(true), 500);
          } catch(e) {
            console.error("Failed to parse game data for error reporting:", e);
          }
          // Clear it so it only prompts once
          sessionStorage.removeItem('lastDownloadedGame');
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <ErrorReportModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)}
      game={reportedGame}
    />
  );
}
