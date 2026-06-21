import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Layout components
import CookieConsentPopup from './components/CookieConsentPopup';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import Preloader   from './components/Preloader';

// Home page sections
import Header      from './components/Header';
import HomeSections from './components/Homesections';

// Pages
import Projects from './pages/Projects';
import Skills   from './pages/Skills';
import About    from './pages/About';
import Contact  from './pages/Contact';

// Shared page styles
import './pages.css';

// Home page — Header hero + 3 scroll sections (Skills → About → Stats)
function Home() {
  return (
    <>
      <Header />
      <HomeSections />
    </>
  );
}

function App() {
  return (
    <Router>
      <Preloader />
      <CookieConsentPopup />
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
