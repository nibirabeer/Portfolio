import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Layout components
import CookieConsentPopup from './components/CookieConsentPopup';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import Preloader   from './components/Preloader';

// Home page sections
import Header      from './components/Header';
import ProjectStack from './components/ProjectStack';
import HomeSections from './components/HomeSections';

// Pages
import Projects from './pages/Projects';
import Skills   from './pages/Skills';
import About    from './pages/About';
import Contact  from './pages/Contact';

// Shared page styles
import './pages.css';

// Home page — Header hero, shuffling project deck, then 3 scroll sections
function Home() {
  return (
    <>
      <Header />
      <ProjectStack />
      <HomeSections />
    </>
  );
}

const COOKIE_CONSENT_KEY = 'cookie-consent';

function App() {
  const [cookieVisible, setCookieVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) setCookieVisible(true);
  }, []);

  const handleCookieChoice = (choice) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    setCookieVisible(false);
  };

  return (
    <Router>
      <Preloader />
      <CookieConsentPopup
        visible={cookieVisible}
        onAccept={() => handleCookieChoice('accepted')}
        onReject={() => handleCookieChoice('rejected')}
      />
      <Navbar />

      <Routes>
        <Route path="/"         element={<Home />}     />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills"   element={<Skills />}   />
        <Route path="/about"    element={<About />}    />
        <Route path="/contact"  element={<Contact />}  />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
