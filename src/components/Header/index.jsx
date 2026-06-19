import React from 'react';
import Background from '../Background';
import './Header.css';

const MARQUEE_TEXT = 'NIBIR ABEER · NIBIR ABEER · NIBIR ABEER · NIBIR ABEER · ';

function Header() {
  return (
    <Background>
      <div className="header-container relative flex items-center justify-center">

        {/* Infinite left-to-right scrolling text — behind the character */}
        <div className="marquee-wrapper" aria-hidden="true">
          <div className="marquee-track">
            <span>{MARQUEE_TEXT}</span>
            <span>{MARQUEE_TEXT}</span>
          </div>
        </div>

        {/* Character image — sits in front of the marquee */}
        <img
          src="/C1.png"
          alt="Header Image"
          className="header-image object-cover"
        />

      </div>
    </Background>
  );
}

export default Header;
