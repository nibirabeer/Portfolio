import React from 'react';
import { Link } from 'react-router-dom';
import '../pages.css';
import './About.css';

const TIMELINE = [
  { 
    year: '2026', 
    title: 'BSc (Hons) Computer Science Graduate', 
    desc: 'Graduated from the University of Bedfordshire with Honors. Currently taking on complex freelance challenges and seeking a full-time role to apply my engineering skills.' 
  },
  { 
    year: '2025', 
    title: 'FinWizard — Capstone Project', 
    desc: 'Engineered an AI-powered personal finance ecosystem using React, Node.js, and Firebase, integrating the OpenAI API for intelligent financial insights.' 
  },
  { 
    year: '2025', 
    title: 'Banana Equation Game', 
    desc: 'Architected a Java-based turn-driven game featuring custom GUI components, Firebase authentication, and real-time leaderboard synchronization.' 
  },
  { 
    year: '2024', 
    title: 'Full-Stack Development & Pancraft', 
    desc: 'Expanded into full-stack architecture with Pancraft, mastering React state management and Firebase NoSQL database structures.' 
  },
  { 
    year: '2022', 
    title: 'The Journey Begins', 
    desc: 'Started BSc at the University of Bedfordshire, establishing a foundation in Software Engineering, Agile methodologies, and AI principles.' 
  },
];

const INTERESTS = ['Full-Stack Development', 'AI & Machine Learning', 'UI/UX Design', 'Game Development', 'Open Source', 'Agile Methodologies'];

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="page-hero fade-up">
        <p className="page-tag"><span className="page-tag-dot" /> The person behind the code</p>
        <h1 className="page-title">About <span>Me</span></h1>
        <p className="page-subtitle">
          Computer science student, builder, and design-obsessed developer based in the UK.
        </p>
      </div>

      <div className="page-section">
        <div className="about-grid">

          {/* Left — bio */}
          <div className="fade-up fade-up-1">
            <div className="card about-bio-card">
              <div className="about-avatar">NA</div>
              <h2 className="about-name">Nibir Abeer</h2>
              <p className="about-role">Frontend &amp; Full-Stack Developer</p>
              <p className="about-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                United Kingdom
              </p>
              <p className="about-bio">
                I am a recent Computer Science graduate with Honors from the University of Bedfordshire, dedicated to the art of building seamless digital experiences. My work lives at the intersection of design and engineering—where clean, efficient code meets intuitive UI.
              </p>
              <p className="about-bio">
                When I'm not coding, I'm exploring new frameworks, contributing to coursework
                projects, or dreaming up the next thing to build.
              </p>

              <div className="about-interests">
                <p className="about-interests-label">Interests</p>
                <div className="about-interest-tags">
                  {INTERESTS.map(i => <span className="pill" key={i}>{i}</span>)}
                </div>
              </div>

              <Link to="/contact" className="about-cta">Get in touch ↗</Link>
            </div>
          </div>

          {/* Right — timeline */}
          <div className="fade-up fade-up-2">
            <p className="about-section-label">Journey</p>
            <div className="timeline">
              {TIMELINE.map((item, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-left">
                    <span className="timeline-year">{item.year}</span>
                    <div className="timeline-line" />
                  </div>
                  <div className="timeline-content card">
                    <h4 className="timeline-title">{item.title}</h4>
                    <p className="timeline-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
