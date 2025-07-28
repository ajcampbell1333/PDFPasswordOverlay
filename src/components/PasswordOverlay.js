import React from 'react';

function PasswordOverlay({ 
  password, 
  setPassword, 
  handlePasswordSubmit, 
  handleKeyPress, 
  error, 
  isAnimating, 
  passwordInputRef 
}) {
  return (
    <div className={`password-overlay ${isAnimating ? 'animate-out' : ''}`}>
      <div className="overlay-content">
        <div className="lock-icon">🔒</div>
        <h2>Protected Document</h2>
        <p>Please enter the password to view this document</p>
        
        <div className="password-form">
          <label htmlFor="password-input">Password:</label>
          <input
            ref={passwordInputRef}
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter password"
            className={error ? 'error' : ''}
          />
          {error && <div className="error-message">{error}</div>}
          <button 
            onClick={handlePasswordSubmit}
            className="enter-button"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordOverlay; 