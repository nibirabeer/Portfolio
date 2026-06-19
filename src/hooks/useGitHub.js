import { useState, useEffect } from 'react';

const USERNAME = 'nibirabeer';
const CACHE_KEY = 'gh_repos_v2';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    return Date.now() - ts < CACHE_TTL ? data : null;
  } catch { return null; }
}

function putCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export function useGitHubRepos() {
  const [repos, setRepos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setRepos(cached);
      setLoading(false);
      return;
    }

    fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`,
      { headers: { Accept: 'application/vnd.github+json' } }
    )
      .then(r => {
        if (!r.ok) throw new Error(`GitHub ${r.status}`);
        return r.json();
      })
      .then(data => {
        const filtered = data.filter(r => !r.fork);
        putCache(filtered);
        setRepos(filtered);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { repos, loading, error };
}

// ── Helpers used by both Projects and Skills pages ────────────

export function prettifyName(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function detectTag(repo) {
  const topics = repo.topics || [];
  const desc  = (repo.description || '').toLowerCase();
  const name  = repo.name.toLowerCase();
  const lang  = (repo.language || '').toLowerCase();

  const AI_TOPICS = ['ai','ml','machine-learning','openai','nlp','deep-learning','artificial-intelligence','chatgpt'];
  const GAME_TOPICS = ['game','gaming','game-development','unity','godot','pygame','libgdx'];

  if (topics.some(t => AI_TOPICS.includes(t)) || desc.includes('openai') || desc.includes('machine learning'))
    return 'AI';

  if (topics.some(t => GAME_TOPICS.includes(t)) || lang === 'gdscript' || name.includes('game') || desc.includes('game'))
    return 'Game';

  return 'Web';
}

export function detectStatus(repo) {
  if (repo.archived) return 'Archived';
  const days = (Date.now() - new Date(repo.pushed_at)) / 86_400_000;
  return days < 90 ? 'In Progress' : 'Completed';
}

export function getStack(repo) {
  const TOPIC_LABEL = {
    react: 'React', firebase: 'Firebase', nodejs: 'Node.js', 'node-js': 'Node.js',
    python: 'Python', java: 'Java', typescript: 'TypeScript', tailwind: 'Tailwind',
    vite: 'Vite', nextjs: 'Next.js', 'next-js': 'Next.js', express: 'Express',
    mongodb: 'MongoDB', openai: 'OpenAI API', swing: 'Swing',
  };
  const stack = new Set();
  if (repo.language) stack.add(repo.language);
  (repo.topics || []).forEach(t => {
    if (TOPIC_LABEL[t] && stack.size < 4) stack.add(TOPIC_LABEL[t]);
  });
  return [...stack].slice(0, 4);
}

// Derive language skill levels from repo primary-language counts
export function computeLangSkills(repos) {
  const counts = {};
  repos.forEach(r => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  });
  const max = Math.max(...Object.values(counts), 1);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      level: Math.round(55 + (count / max) * 40), // 55–95 range
    }));
}
