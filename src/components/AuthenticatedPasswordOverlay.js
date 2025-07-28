import React, { useState, useRef, useEffect } from 'react';
import PasswordOverlay from './PasswordOverlay';

function AuthenticatedPasswordOverlay({ correctPassword, children }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const passwordInputRef = useRef(null);

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setError('');
      setIsAnimating(true);
      // Wait for animation to complete before setting authenticated
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsAnimating(false);
      }, 500);
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