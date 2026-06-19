import React from 'react';
import { Link } from 'react-router-dom';
import '../pages.css';
import './About.css';

const TIMELINE = [
  {
    year: '2025',
    title: 'BSc (Hons) Computer Science — 2:1',
    desc: 'Graduated from the University of Bedfordshire with a Second Class Upper Division (2:1) Honours degree. Now actively seeking a full-time software engineering role while taking on freelance projects.',
  },
  {
    year: '2024–25',
    title: 'Final Year — Distributed Systems & Undergraduate Project',
    desc: 'Completed Distributed Service Architectures, Agile Project Management, and Research Methodologies. Built FinWizard as my undergraduate project — an AI-powered personal finance app using React, Node.js, Firebase, and the OpenAI API.',
  },
  {
    year: '2023–24',
    title: 'Year 2 — AI, Security & Web Technologies',
    desc: 'Studied Information Security, Desktop Applications Development & Software Engineering, Concepts and Technologies of AI, and Web Technologies and Platforms. Built Banana Equation (Java/Firebase game) and Pencraft (collaborative writing platform).',
  },
  {
    year: '2022–23',
    title: 'Year 1 — CS Foundations',
    desc: 'Established core knowledge across CS Fundamentals, Mathematics and Concepts for Computational Thinking, Databases & Computer Networks, and Principles of Programming & Data Structures.',
  },
  {
    year: '2022',
    title: 'The Journey Begins',
    desc: 'Enrolled at the University of Bedfordshire, University Square Campus, Luton to study Computer Science — and wrote my very first lines of code.',
  },
];

const INTERESTS = [
  'Full-Stack Development',
  'AI & Machine Learning',
  'Information Security',
  'Distributed Systems',
  'UI/UX Design',
  'Agile Methodologies',
];

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="page-hero fade-up">
        <p className="page-tag"><span className="page-tag-dot" /> The person behind the code</p>
        <h1 className="page-title">About <span>Me</span></h1>
        <p className="page-subtitle">
          Computer Science graduate, builder, and design-obsessed developer based in the UK.
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

              <div className="about-degree-badge">
                <div>
                  <p className="about-degree-title">BSc (Hons) Computer Science — 2:1</p>
                  <p className="about-degree-uni">University of Bedfordshire · Luton, UK · 2025</p>
                </div>
              </div>

              <p className="about-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                United Kingdom
              </p>

              <p className="about-bio">
                I'm a Computer Science graduate from the University of Bedfordshire with a 2:1 Honours degree,
                specialising in full-stack development, AI integration, and distributed systems.
                My work lives at the intersection of design and engineering — where clean, efficient code meets intuitive UI.
              </p>
              <p className="about-bio">
                Through three years of study and hands-on projects I've built everything from AI-powered finance apps
                and collaborative writing platforms to Java games with real-time leaderboards.
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
