import React from 'react';
import '../pages.css';
import './Skills.css';
import { useGitHubRepos, computeLangSkills } from '../hooks/useGitHub';

const STATIC_GROUPS = [
  {
    category: 'Frontend',
    icon: '◈',
    skills: [
      { name: 'React',       level: 90 },
      { name: 'JavaScript',  level: 85 },
      { name: 'HTML & CSS',  level: 92 },
      { name: 'Tailwind',    level: 78 },
    ],
  },
  {
    category: 'Backend',
    icon: '◉',
    skills: [
      { name: 'Node.js',   level: 72 },
      { name: 'Firebase',  level: 85 },
      { name: 'REST APIs', level: 80 },
    ],
  },
  {
    category: 'AI & ML',
    icon: '◎',
    skills: [
      { name: 'OpenAI API',    level: 75 },
      { name: 'ML Concepts',   level: 65 },
      { name: 'Data Analysis', level: 60 },
    ],
  },
  {
    category: 'Tools',
    icon: '◈',
    skills: [
      { name: 'Git & GitHub', level: 88 },
      { name: 'Figma',        level: 70 },
      { name: 'VS Code',      level: 95 },
      { name: 'Eclipse',      level: 75 },
    ],
  },
  {
    category: 'Soft Skills',
    icon: '◐',
    skills: [
      { name: 'Agile / Scrum',      level: 80 },
      { name: 'Problem Solving',    level: 88 },
      { name: 'Team Collaboration', level: 90 },
    ],
  },
];

function SkillBar({ name, level, delay }) {
  return (
    <div className="skill-row" style={{ animationDelay: `${delay}s` }}>
      <div className="skill-row-top">
        <span className="skill-name">{name}</span>
        <span className="skill-pct">{level}%</span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{ width: `${level}%`, animationDelay: `${delay + 0.1}s` }}
        />
      </div>
    </div>
  );
}

function SkeletonBar() {
  return (
    <div className="skill-row">
      <div className="skill-row-top">
        <div className="skel" style={{ width: 90, height: 14, borderRadius: 6 }} />
        <div className="skel" style={{ width: 34, height: 14, borderRadius: 6 }} />
      </div>
      <div className="skill-track">
        <div className="skel" style={{ width: '60%', height: '100%', borderRadius: 999 }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const { repos, loading } = useGitHubRepos();

  const langSkills = loading ? [] : computeLangSkills(repos);

  const languageGroup = {
    category: 'Languages',
    icon: '◇',
    skills: langSkills,
    fromGitHub: true,
    repoCount: repos.length,
  };

  const groups = [
    STATIC_GROUPS[0],
    STATIC_GROUPS[1],
    languageGroup,
    ...STATIC_GROUPS.slice(2),
  ];

  return (
    <div className="page-wrapper">
      <div className="page-hero fade-up">
        <p className="page-tag"><span className="page-tag-dot" /> What I know</p>
        <h1 className="page-title">My <span>Skills</span></h1>
        <p className="page-subtitle">
          Technologies and tools I've picked up through projects, coursework, and relentless building.
        </p>
      </div>

      <div className="page-section">
        <div className="page-divider" />
        <div className="grid-2">
          {groups.map((group, gi) => (
            <div className={`card fade-up fade-up-${(gi % 4) + 1}`} key={group.category}>
              <div className="skill-group-header">
                <span className="skill-icon">{group.icon}</span>
                <h3 className="skill-group-title">{group.category}</h3>
                {group.fromGitHub && !loading && (
                  <span className="skill-gh-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    from {group.repoCount} repos
                  </span>
                )}
              </div>
              <div className="skill-list">
                {loading && group.fromGitHub
                  ? [...Array(4)].map((_, i) => <SkeletonBar key={i} />)
                  : group.skills.map((s, si) => (
                      <SkillBar key={s.name} name={s.name} level={s.level} delay={gi * 0.06 + si * 0.05} />
                    ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
