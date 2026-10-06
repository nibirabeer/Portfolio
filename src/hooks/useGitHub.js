import { useState, useEffect } from 'react';

const USERNAME = 'nibirabeer';
const CACHE_KEY = 'gh_repos_v4';
const CACHE_TTL = 15 * 60 * 1000;

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!Array.isArray(entry.data)) return null;
    return entry;
  } catch { return null; }
}

function putCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

async function fetchAllRepos() {
  const repos = [];
  let url = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      const rateLimitReached = response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0';
      throw new Error(rateLimitReached
        ? 'GitHub rate limit reached. Please retry after it resets.'
        : `GitHub could not return repositories (HTTP ${response.status}).`);
    }

    const page = await response.json();
    if (!Array.isArray(page)) throw new Error('GitHub returned an unexpected repository response.');
    repos.push(...page);
    const next = response.headers.get('link')?.match(/<([^>]+)>;\s*rel="next"/);
    url = next?.[1] || null;
  }

  return repos.filter(repo => !repo.fork);
}

export function useGitHubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    const cached = readCache();
    const hasCache = Boolean(cached?.data?.length);
    const cacheIsFresh = cached && Date.now() - cached.ts < CACHE_TTL;

    if (hasCache) setRepos(cached.data);
    if (cacheIsFresh && retryCount === 0) {
      setLoading(false);
      setError(null);
      return () => { active = false; };
    }

    setLoading(!hasCache);
    setError(null);

    fetchAllRepos()
      .then(data => {
        if (!active) return;
        putCache(data);
        setRepos(data);
      })
      .catch(requestError => {
        if (!active) return;
        setError(requestError.message || 'GitHub is temporarily unavailable.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [retryCount]);

  return { repos, loading, error, retry: () => setRetryCount(count => count + 1) };
}

// ── Helpers ───────────────────────────────────────────────────

export function prettifyName(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Shared with the Projects grid and the homepage slider so a project's tag
// always reads as the same color everywhere it appears.
export const TAG_STYLE = {
  'Web':  { bg: '#eff6ff', color: '#1d4ed8' },
  'AI':   { bg: '#f5f3ff', color: '#7c3aed' },
  'Game': { bg: '#fff7ed', color: '#c2410c' },
};

export function detectTag(repo) {
  const topics = repo.topics || [];
  const desc   = (repo.description || '').toLowerCase();
  const name   = repo.name.toLowerCase();
  const lang   = (repo.language || '').toLowerCase();

  const AI_TOPICS   = ['ai','ml','machine-learning','openai','nlp','deep-learning','artificial-intelligence','chatgpt'];
  const GAME_TOPICS = ['game','gaming','game-development','unity','godot','pygame','libgdx'];

  if (topics.some(t => AI_TOPICS.includes(t)) || desc.includes('openai') || desc.includes('machine learning'))
    return 'AI';
  if (topics.some(t => GAME_TOPICS.includes(t)) || lang === 'gdscript' || name.includes('game') || desc.includes('game'))
    return 'Game';
  return 'Web';
}

// Deployment status comes from the archived flag and a live deployment link.
// Avoid per-repository commit requests: they exhaust GitHub's anonymous API quota.
export function detectStatus(repo, hasVercelUrl = false) {
  if (repo.archived) return 'Archived';
  return hasVercelUrl ? 'Completed' : 'In Progress';
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
      level: Math.round(55 + (count / max) * 40),
    }));
}
