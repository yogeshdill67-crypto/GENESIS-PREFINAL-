import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;
const DB_PATH = 'E:/genesis_data/db.json';

app.use(cors());
app.use(express.json());

// Root route — status page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Genesis API Server</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #0f0f1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .card {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 1px solid #7c3aed44;
          border-radius: 16px;
          padding: 40px 50px;
          text-align: center;
          box-shadow: 0 0 40px #7c3aed33;
        }
        .dot { display: inline-block; width: 12px; height: 12px; background: #22c55e; border-radius: 50%; margin-right: 8px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        h1 { font-size: 2rem; color: #a78bfa; margin: 16px 0 8px; }
        p { color: #94a3b8; margin: 6px 0; }
        .routes { margin-top: 20px; text-align: left; background: #0f0f1a; border-radius: 10px; padding: 16px 20px; }
        .routes p { font-family: monospace; font-size: 0.85rem; color: #67e8f9; margin: 4px 0; }
        .badge { display: inline-block; background: #22c55e22; color: #22c55e; border: 1px solid #22c55e55; border-radius: 6px; padding: 2px 10px; font-size: 0.75rem; margin-left: 6px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div><span class="dot"></span><strong style="color:#22c55e">Server Online</strong></div>
        <h1>⚡ Genesis API</h1>
        <p>Backend is running on <strong>http://localhost:${PORT}</strong></p>
        <div class="routes">
          <p>GET  /api/posts <span class="badge">live</span></p>
          <p>POST /api/posts <span class="badge">live</span></p>
          <p>GET  /api/profile <span class="badge">live</span></p>
          <p>POST /api/profile <span class="badge">live</span></p>
          <p>GET  /api/messages <span class="badge">live</span></p>
          <p>POST /api/messages <span class="badge">live</span></p>
          <p>GET  /api/communities <span class="badge">live</span></p>
          <p>POST /api/communities <span class="badge">live</span></p>
          <p>GET  /api/network <span class="badge">live</span></p>
          <p>POST /api/network <span class="badge">live</span></p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Initialize database
async function initDB() {
  try {
    await fs.ensureDir(path.dirname(DB_PATH));
    const exists = await fs.pathExists(DB_PATH);
    if (!exists) {
      const initialData = {
        posts: [],
        communities: [],
        profile: null,
        network: [],
        messages: []
      };
      await fs.writeJson(DB_PATH, initialData, { spaces: 2 });
      console.log('Database initialized on E: drive');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDB();

// Helper to read DB
const readDB = async () => await fs.readJson(DB_PATH);
// Helper to write DB
const writeDB = async (data) => await fs.writeJson(DB_PATH, data, { spaces: 2 });

// POSTS
app.get('/api/posts', async (req, res) => {
  const db = await readDB();
  res.json(db.posts);
});

app.post('/api/posts', async (req, res) => {
  const db = await readDB();
  db.posts = req.body;
  await writeDB(db);
  res.json({ success: true });
});

// PROFILE
app.get('/api/profile', async (req, res) => {
  const db = await readDB();
  res.json(db.profile);
});

app.post('/api/profile', async (req, res) => {
  const db = await readDB();
  db.profile = req.body;
  await writeDB(db);
  res.json({ success: true });
});

// MESSAGES
app.get('/api/messages', async (req, res) => {
  const db = await readDB();
  res.json(db.messages);
});

app.post('/api/messages', async (req, res) => {
  const db = await readDB();
  db.messages = req.body;
  await writeDB(db);
  res.json({ success: true });
});

// COMMUNITIES
app.get('/api/communities', async (req, res) => {
  const db = await readDB();
  res.json(db.communities);
});

app.post('/api/communities', async (req, res) => {
  const db = await readDB();
  db.communities = req.body;
  await writeDB(db);
  res.json({ success: true });
});

// NETWORK
app.get('/api/network', async (req, res) => {
  const db = await readDB();
  res.json(db.network);
});

app.post('/api/network', async (req, res) => {
  const db = await readDB();
  db.network = req.body;
  await writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Genesis Backend running at http://localhost:${PORT}`);
});
