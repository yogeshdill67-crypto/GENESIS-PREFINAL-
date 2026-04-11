// ── GENESIS Global Data Store ──
import { DATA_PART_1 } from './careers_p1';
import { DATA_PART_2 } from './careers_p2';
import { DATA_PART_3 } from './careers_p3';
import { DATA_PART_4 } from './careers_p4';

export const careers = [
  ...DATA_PART_1,
  ...DATA_PART_2,
  ...DATA_PART_3,
  ...DATA_PART_4
];

export const CAREER_CATEGORIES = [
  "All",
  "Programming",
  "Data & AI",
  "Cloud & DevOps",
  "Cybersecurity",
  "Product & Design",
  "Marketing & Content",
  "Finance & Biz",
  "Healthcare",
  "Education",
  "Electronics (ECE)",
  "Mechanical Engg",
  "Civil Engg",
  "Electrical Engg",
  "Chemical Engg",
  "Aerospace Engg",
  "Biotech Engg",
  "Freelancing",
  "Law & Legal Tech",
  "Architecture & Design",
  "Media & Journalism",
  "Psychology & Counselling",
  "Agriculture & AgriTech",
  "Hospitality & Tourism",
  "Real Estate",
  "Sports & Fitness",
  "Fashion & Textile",
  "Food Technology",
  "Marine Engg",
  "Mining & Metallurgy",
  "Other"
];

// Posts
export const defaultPosts = [];

export const defaultCommunities = [
  { id: 1, name: 'CS & AI', domain: 'B.Tech → CSE', members: 12400, tags: ['#ML', '#WebDev', '#AI'], joined: false },
  { id: 2, name: 'Mech & EV', domain: 'B.Tech → Mech', members: 6820, tags: ['#EV', '#CAD', '#Design'], joined: false },
  { id: 3, name: 'MBA Startups', domain: 'MBA', members: 5330, tags: ['#VC', '#Startups', '#Finance'], joined: true },
  { id: 4, name: 'Data Science', domain: 'B.Tech → CSE', members: 9800, tags: ['#Python', '#Analytics'], joined: false },
  { id: 5, name: 'Civil & Infra', domain: 'B.Tech → Civil', members: 3200, tags: ['#Urban', '#GIS'], joined: false },
];

export const domainTree = {
  'B.Tech': {
    'Computer Science': {
      roles: {
        'ML Engineer':   { skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'], companies: ['Google', 'OpenAI', 'Microsoft', 'Meta'], salary: '₹10L – ₹30L' },
        'Backend Dev':   { skills: ['Node.js', 'Java', 'Go', 'PostgreSQL'], companies: ['Amazon', 'Atlassian', 'Stripe', 'Razorpay'], salary: '₹8L – ₹25L' },
        'Frontend Dev':  { skills: ['React', 'TypeScript', 'CSS', 'GraphQL'], companies: ['Figma', 'Shopify', 'Swiggy', 'Zomato'], salary: '₹7L – ₹22L' },
        'DevOps':        { skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'], companies: ['Netflix', 'Cloudflare', 'PhonePe'], salary: '₹9L – ₹28L' },
      }
    },
    'Mechanical': {
      roles: {
        'EV Engineer':      { skills: ['MATLAB', 'Battery BMS', 'Thermal Mgmt'], companies: ['Tesla', 'Ather', 'OLA Electric'], salary: '₹6L – ₹20L' },
        'Product Designer': { skills: ['SolidWorks', 'Creo', 'FEA', 'GD&T'], companies: ['Bosch', 'Mahindra', 'Tata Motors'], salary: '₹5L – ₹16L' },
      }
    },
    'Civil': {
      roles: {
        'Urban Planner':    { skills: ['AutoCAD', 'GIS', 'STAAD Pro'], companies: ['L&T', 'DLF', 'NHAI'], salary: '₹5L – ₹14L' },
      }
    }
  },
  'MBA': {
    'Marketing': {
      roles: {
        'Growth Hacker': { skills: ['SEO', 'Analytics', 'A/B Testing', 'Meta Ads'], companies: ['PhonePe', 'Flipkart', 'Meesho'], salary: '₹7L – ₹20L' },
        'Brand Manager': { skills: ['Brand Strategy', 'Consumer Psychology', 'PR'], companies: ['HUL', 'P&G', 'Nestlé'], salary: '₹8L – ₹22L' },
      }
    },
    'Finance': {
      roles: {
        'Investment Analyst': { skills: ['Excel', 'Valuation', 'CFA', 'Bloomberg'], companies: ['Morgan Stanley', 'Goldman Sachs', 'HDFC'], salary: '₹10L – ₹35L' },
      }
    }
  }
};

// notification sample data
export const sampleNotifications = [
  { id: 1, text: 'Arjun liked your post', time: '2m ago', read: false },
  { id: 2, text: 'New paths in ML added', time: '1h ago', read: false },
  { id: 3, text: 'Priya commented on your post', time: '3h ago', read: true },
];

// localStorage helpers
export function getPosts() {
  try { 
    const p = localStorage.getItem('g_posts'); 
    let parsed = p ? JSON.parse(p) : []; 
    if (!Array.isArray(parsed)) parsed = [];
    // Filter out legacy fake posts (IDs 1, 2, 3)
    parsed = parsed.filter(post => post && ![1, 2, 3].includes(post.id));
    return parsed;
  } catch { 
    return []; 
  }
}
export function savePosts(posts) {
  try { localStorage.setItem('g_posts', JSON.stringify(posts)); } catch {}
}
export function getCommunities() {
  try { const c = localStorage.getItem('g_comms'); return c ? JSON.parse(c) : [...defaultCommunities]; } catch { return [...defaultCommunities]; }
}
export function saveCommunities(communities) {
  try { localStorage.setItem('g_comms', JSON.stringify(communities)); } catch {}
}
export function getProfile() {
  try { 
    const p = localStorage.getItem('g_profile'); 
    return p ? JSON.parse(p) : { name: 'Alex Dev', path: 'B.Tech → CSE → ML Engineer', headline: 'AI Enthusiast & Software Engineer', bio: 'Passionate about AI and building cool stuff.', avatar: null, coverImage: null, connections: 340, followers: 890, communities: 5, education: [{id: 1, degree: 'B.Tech CSE', school: 'Indian Institute of Technology', year: '2020-2024'}], experience: [{id: 1, role: 'SWE Intern', company: 'Google', year: 'Summer 2023'}], portfolio: [] }; 
  } catch { 
    return { name: 'Alex Dev', path: 'B.Tech → CSE → ML Engineer', headline: 'AI Enthusiast & Software Engineer', bio: 'Passionate about AI and building cool stuff.', avatar: null, coverImage: null, connections: 340, followers: 890, communities: 5, education: [], experience: [], portfolio: [] }; 
  }
}
export function saveProfile(profile) {
  try { localStorage.setItem('g_profile', JSON.stringify(profile)); } catch {}
}

export const defaultNetwork = [
  { id: 101, name: 'Rahul Sharma', path: 'B.Tech → Mech → Design Engineer', avatar: null, status: 'suggested', mutual: 12 },
  { id: 102, name: 'Sneha Patel', path: 'MBA → Marketing → Brand Manager', avatar: null, status: 'pending', mutual: 3 },
  { id: 103, name: 'Ananya Desai', path: 'B.Tech → CSE → Frontend Developer', avatar: null, status: 'suggested', mutual: 8 },
  { id: 104, name: 'Vikram Singh', path: 'B.Tech → Civil → Structural Engg', avatar: null, status: 'connected', mutual: 15 },
];

export function getNetwork() {
  try { const n = localStorage.getItem('g_network'); return n ? JSON.parse(n) : [...defaultNetwork]; } catch { return [...defaultNetwork]; }
}
export function saveNetwork(net) {
  try { localStorage.setItem('g_network', JSON.stringify(net)); } catch {}
}

export function getTheme() {
  return localStorage.getItem('g_theme') || 'dark';
}
export function saveTheme(t) {
  localStorage.setItem('g_theme', t);
}
export function isLoggedIn() {
  return !!localStorage.getItem('g_auth');
}
export function login(user) {
  localStorage.setItem('g_auth', JSON.stringify(user));
  if (user.isSignup) {
    saveProfile({
      name: user.name || user.email.split('@')[0],
      path: '',
      headline: '',
      bio: '',
      avatar: null,
      coverImage: null,
      connections: 0,
      followers: 0,
      communities: 0,
      education: [],
      experience: [],
      portfolio: []
    });
  }
}
export function logout() {
  localStorage.removeItem('g_auth');
}

export const defaultMessages = [
  { id: 1, contactId: 104, contactName: 'Vikram Singh', avatar: null, unread: 0, 
    messages: [
      { id: 1001, sender: 'them', text: 'Hey, saw your post about ML!', time: '10:00 AM' },
      { id: 1002, sender: 'me', text: 'Yeah! It’s an interesting field. Let me know if you want to chat about it.', time: '10:05 AM' }
    ] 
  }
];

export function getConversations() {
  try { const m = localStorage.getItem('g_messages'); return m ? JSON.parse(m) : [...defaultMessages]; } catch { return [...defaultMessages]; }
}
export function saveConversations(conversations) {
  try { localStorage.setItem('g_messages', JSON.stringify(conversations)); } catch {}
}

