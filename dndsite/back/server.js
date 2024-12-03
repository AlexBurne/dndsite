const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Schemas and Models
const WorldSchema = new mongoose.Schema({
  name: String,
  description: String,
  creatorId: String, // Placeholder for user ID
});

const LoreSchema = new mongoose.Schema({
  title: String,
  type: String, // 'place', 'character', etc.
  content: String,
  visibility: { type: String, default: 'private' }, // 'private', 'hidden', 'public'
  creatorId: String,
  associatedWorld: String,
});

const World = mongoose.model('World', WorldSchema);
const Lore = mongoose.model('Lore', LoreSchema);

// Routes: World CRUD
app.post('/api/worlds', async (req, res) => {
  const { name, description, creatorId } = req.body;
  try {
    const newWorld = await World.create({ name, description, creatorId });
    res.status(201).json(newWorld);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/worlds', async (req, res) => {
  try {
    const worlds = await World.find();
    res.json(worlds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/worlds/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedWorld = await World.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.json(updatedWorld);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/worlds/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await World.findByIdAndDelete(id);
    res.json({ message: 'World deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes: Lore CRUD
app.post('/api/lore', async (req, res) => {
  const { title, type, content, visibility, creatorId, associatedWorld } = req.body;
  try {
    const newLore = await Lore.create({
      title,
      type,
      content,
      visibility,
      creatorId,
      associatedWorld,
    });
    res.status(201).json(newLore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/lore', async (req, res) => {
  const { worldId } = req.query;
  try {
    const lore = await Lore.find({ associatedWorld: worldId });
    res.json(lore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/lore/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, visibility } = req.body;
  try {
    const updatedLore = await Lore.findByIdAndUpdate(
      id,
      { title, content, visibility },
      { new: true }
    );
    res.json(updatedLore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/lore/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Lore.findByIdAndDelete(id);
    res.json({ message: 'Lore deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
