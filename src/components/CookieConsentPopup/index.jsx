// CookieConsentPopup.jsx

import React from 'react';
import './CookieConsentPopup.css'; // Import the CSS file for styles

function CookieConsentPopup({ visible, onAccept, onReject }) {
  if (!visible) return null; // Do not render if not visible

  return (
    <div className="cookie-popup">
      <p className="cookie-message">We use cookies to improve your experience. Do you accept?</p>
      <div className="cookie-buttons">
        <button className="cookie-button accept" onClick={onAccept}>Accept</button>
        <button className="cookie-button reject" onClick={onReject}>Reject</button>
      </div>
    </div>
  );
}

export default CookieConsentPopup;