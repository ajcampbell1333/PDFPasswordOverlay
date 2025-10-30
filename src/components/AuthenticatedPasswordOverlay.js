import React, { useState, useRef, useEffect } from 'react';
import PasswordOverlay from './PasswordOverlay';

// iOS detection function
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

function AuthenticatedPasswordOverlay({ correctPassword, serverHostedPDF, dockerServerUrl, pdfFilename, onTokenReceived, onPngModeReceived, children }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const passwordInputRef = useRef(null);

  const handlePasswordSubmit = async () => {
    if (password === correctPassword) {
      setError('');
      setIsAnimating(true);
      
      // If using server-hosted PDF, authenticate with Docker server first
      if (serverHostedPDF && dockerServerUrl) {
        try {
          const response = await fetch(`${dockerServerUrl}/auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              password: password,
              isIOS: isIOS(),
              pdfFilename: pdfFilename
            }),
          });

          if (response.ok) {
            const data = await response.json();
            onTokenReceived(data.token);
            
            // Check if server wants us to use PNG mode
            if (data.usePngMode && data.pngFiles) {
              onPngModeReceived(data);
            }
            
            // Wait for animation to complete before setting authenticated
            setTimeout(() => {
              setIsAuthenticated(true);
              setIsAnimating(false);
            }, 500);
          } else {
            setError('Authentication failed. Please try again.');
            setPassword('');
            setIsAnimating(false);
            passwordInputRef.current?.focus();
          }
        } catch (err) {
          setError('Unable to connect to server. Please try again.');
          setPassword('');
          setIsAnimating(false);
          passwordInputRef.current?.focus();
        }
      } else {
        // Local PDF - no server authentication needed
        setTimeout(() => {
          setIsAuthenticated(true);
          setIsAnimating(false);
        }, 500);
      }
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
      passwordInputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  useEffect(() => {
    // Focus on password input when component mounts
    passwordInputRef.current?.focus();
  }, []);

  return (
    <>
      {children}
      
      {!isAuthenticated && (
        <PasswordOverlay
          password={password}
          setPassword={setPassword}
          handlePasswordSubmit={handlePasswordSubmit}
          handleKeyPress={handleKeyPress}
          error={error}
          isAnimating={isAnimating}
          passwordInputRef={passwordInputRef}
        />
      )}
    </>
  );
}

export default AuthenticatedPasswordOverlay; 