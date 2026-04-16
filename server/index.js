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
