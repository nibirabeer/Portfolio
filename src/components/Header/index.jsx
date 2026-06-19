import React, { useEffect, useState } from 'react';
import Background from '../Background'; // Adjusted import path
import './Header.css'; // Ensure you have a separate CSS file for styling

function Header() {
  const [scale, setScale] = useState(1); // State to manage zoom level

  // Effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // Get the current scroll position
      const newScale = 1 + scrollTop / 1000; // Adjust zoom factor as needed
      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Background> {/* Wrap the entire content with Background */}
      <div className="header-container relative flex items-center justify-center">
        {/* Main Header Image */}
        <img
          src="/C1.png" // Adjust the image path as needed
          alt="Header Image"
          className="header-image object-cover" // Use object-cover for better responsiveness
        />

        {/* Zooming Text that scales when scrolling down */}
        <div
          className="zooming-text-container"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`, // Apply zoom effect
            position: 'absolute',
            top: '50%', // Center vertically
            left: '50%', // Center horizontally
            transition: 'transform 0.2s ease-in-out', // Smooth transition for zoom
            color: 'black', // Set the text color to black
            fontSize: '14vw', // Responsive font size
            zIndex: 1, // Ensure text is below the header image
            whiteSpace: 'nowrap', // Prevent text from wrapping
          }}
        >
          NIBIR ABEER
        </div>
      </div>
    </Background>
  );
}

export default Header;
