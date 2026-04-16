import fs from 'fs';

const teamMembers = [
  "P yogesh-2511021061608",
  "Pranav R. Jayaram-2511021061714",
  "Pranav Adhithya-2511021061731",
  "Kiran Kumar S.T-2511021061628",
  "Tuhin-2511021061690",
  "Ayyappa-2511021061725",
  "DevaprasadM-2511021061558"
];

const dbPath = 'E:/genesis_data/db.json';

const dbRaw = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(dbRaw);

// Add to network
for (let i = 0; i < teamMembers.length; i++) {
  const member = teamMembers[i];
  if (!db.network.some(n => n.name === member)) {
    db.network.push({
      id: "net_" + i + Date.now(),
      name: member,
      path: "B.Tech → CSE",
      mutual: Math.floor(Math.random() * 20),
      status: "connected"
    });
  }
}

// Add to posts
for (let i = 0; i < teamMembers.length; i++) {
  const member = teamMembers[i];
  // check if post exists
  if (!db.posts.some(p => p.author === member)) {
    db.posts.unshift({ // put new ones at the top
      id: "post_" + i + Date.now(),
      content: "Empowering Career Journeys Through Knowledge, Community & Technology",
      author: member,
      timestamp: Date.now() - (i * 1000 * 60 * 60), // slightly diff times
      likes: Math.floor(Math.random() * 50) + 10,
      isLiked: false,
      comments: Math.floor(Math.random() * 10),
      commentsList: []
    });
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Team members and posts added to DB.");
