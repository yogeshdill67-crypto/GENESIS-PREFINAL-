// ── GENESIS Global Data Store ──
import { DATA_PART_1 } from './careers_p1';
import { DATA_PART_2 } from './careers_p2';
import { DATA_PART_3 } from './careers_p3';
import { DATA_PART_4 } from './careers_p4';
import { DATA_PART_5 } from './careers_p5';

export const careers = [
  ...(Array.isArray(DATA_PART_1) ? DATA_PART_1 : []),
  ...(Array.isArray(DATA_PART_2) ? DATA_PART_2 : []),
  ...(Array.isArray(DATA_PART_3) ? DATA_PART_3 : []),
  ...(Array.isArray(DATA_PART_4) ? DATA_PART_4 : []),
  ...(Array.isArray(DATA_PART_5) ? DATA_PART_5 : [])
];

export const CAREER_CATEGORIES = [
  "All", "Programming", "Data & AI", "Cloud & DevOps", "Cybersecurity", "Product & Design",
  "Marketing & Content", "Finance & Biz", "Healthcare", "Education", "Electronics (ECE)",
  "Mechanical Engg", "Civil Engg", "Electrical Engg", "Chemical Engg", "Aerospace Engg",
  "Biotech Engg", "Freelancing", "Law & Legal Tech", "Architecture & Design", "Media & Journalism",
  "Psychology & Counselling", "Agriculture & AgriTech", "Hospitality & Tourism", "Real Estate",
  "Sports & Fitness", "Fashion & Textile", "Food Technology", "Marine Engg", "Mining & Metallurgy",
  "Social Work & NGO", "Teaching & Academia", "Logistics Tech", "BFSI / Insurance", "FinTech",
  "Wealth Management", "Gems & Jewellery", "Civil Services", "Defence", "Nuclear & Atomic Energy",
  "Automobile", "Manufacturing", "Oil & Gas", "Retail & FMCG", "Ayurveda & AYUSH", 
  "Veterinary Science", "Performing Arts & Music", "E-commerce", "Quantum Computing",
  "Space Technology", "Semiconductor", "Nanotechnology", "Climate Tech", "ESG & Sustainability",
  "Telecom & 5G", "Care Economy", "International Relations", "Humanitarian & Aid",
  "PropTech & ConTech", "Aviation", "Publishing & Print", "Personal Care & Beauty", "Other"
];

// Posts
export const defaultPosts = [];
export const defaultCommunities = [
  { id: 1, name: 'CS & AI', domain: 'B.Tech → CSE', members: 12400, tags: ['#ML', '#WebDev', '#AI'], joined: false },
  { id: 2, name: 'Mech & EV', domain: 'B.Tech → Mech', members: 6820, tags: ['#EV', '#CAD', '#Design'], joined: false },
  { id: 3, name: 'MBA Startups', domain: 'MBA', members: 5330, tags: ['#VC', '#Startups', '#Finance'], joined: true },
  { id: 4, name: 'Data Science', domain: 'B.Tech → CSE', members: 10000, tags: ['#Python', '#Analytics'], joined: false },
  { id: 5, name: 'Civil & Infra', domain: 'B.Tech → Civil', members: 3200, tags: ['#Urban', '#GIS'], joined: false },
];

export const sampleNotifications = [
  { id: 1, text: 'Sarah from Google viewed your profile', time: '2h ago', read: false },
  { id: 2, text: 'New internship posted in Web Development', time: '4h ago', read: false },
  { id: 3, text: 'Your post was liked by 50+ people', time: '1d ago', read: true },
];

// API Helpers
const API_BASE = '/api';

async function apiFetch(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Error fetching ${endpoint}:`, e);
    return null;
  }
}

async function apiSave(endpoint, data) {
  try {
    await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.error(`Error saving ${endpoint}:`, e);
  }
}

// ── Exported Async Functions ──

export async function getPosts() {
  const posts = await apiFetch('/posts');
  return posts || [];
}
export async function savePosts(posts) {
  await apiSave('/posts', posts);
}

export async function getCommunities() {
  const comms = await apiFetch('/communities');
  return comms || [...defaultCommunities];
}
export async function saveCommunities(comms) {
  await apiSave('/communities', comms);
}

export async function getProfile() {
  const profile = await apiFetch('/profile');
  if (profile) return profile;
  
  const auth = getAuth();
  const eduStr = (auth?.edu ? auth.edu.toUpperCase() : 'B.Tech') + (auth?.stream ? ' in ' + auth.stream.replace(/_/g, ' ') : '');
  const expStr = auth?.exp ? (auth.exp.charAt(0).toUpperCase() + auth.exp.slice(1)) + ' Professional' : 'Software Engineer';
  const finalDomain = (auth && auth.domain) ? auth.domain : 'ML Engineer';

  return { 
    name: auth ? (auth.name || auth.email.split('@')[0]) : 'Alex Dev', 
    path: (auth && auth.domain) ? auth.domain : 'B.Tech → CSE → ML Engineer', 
    headline: (auth && auth.domain) ? `${eduStr} | Passionate about ${finalDomain}` : 'AI Enthusiast & Software Engineer', 
    bio: 'Passionate about building cool stuff and solving problems.', 
    avatar: null, 
    coverImage: null, 
    connections: 340, 
    followers: 890, 
    communities: 5, 
    education: auth?.edu ? [{ degree: eduStr, school: 'University / Institution', year: 'Recent' }] : [], 
    experience: auth?.exp ? [{ role: expStr, company: 'Target Industry', duration: 'Current Phase' }] : [], 
    portfolio: [] 
  };
}
export async function saveProfile(profile) {
  await apiSave('/profile', profile);
}

export async function getNetwork() {
  const net = await apiFetch('/network');
  return net || [];
}
export async function saveNetwork(net) {
  await apiSave('/network', net);
}

export async function getConversations() {
  const convos = await apiFetch('/messages');
  return convos || [];
}
export async function saveConversations(convos) {
  await apiSave('/messages', convos);
}

// ── Auth & Theme (Still in localStorage for speed/session) ──

export function getTheme() {
  return localStorage.getItem('g_theme') || 'dark';
}
export function saveTheme(t) {
  localStorage.setItem('g_theme', t);
}

export function saveLastAnalysis(data) {
  localStorage.setItem('g_last_analysis', JSON.stringify(data));
}

export function getLastAnalysis() {
  const raw = localStorage.getItem('g_last_analysis');
  try { return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
}

export function isLoggedIn() {
  return !!localStorage.getItem('g_auth');
}
export function getAuth() {
  const raw = localStorage.getItem('g_auth');
  try { return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
}

export function updateAuth(data) {
  const auth = getAuth();
  if (auth) {
    localStorage.setItem('g_auth', JSON.stringify({ ...auth, ...data }));
  }
}
export function login(user) {
  localStorage.setItem('g_auth', JSON.stringify(user));
  // Note: Profile creation for new users will now happen on the server via saveProfile
}
export function logout() {
  localStorage.removeItem('g_auth');
}
