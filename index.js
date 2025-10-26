require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { getEmotion } = require('./geminiService');

const app = express();
const prisma = new PrismaClient();

const upload = multer({ storage: multer.memoryStorage() });

// Simplified CORS - allow all origins for now
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Emotion Face Reader Backend' });
});

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    console.log('Received analyze request');
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('File received:', req.file.mimetype, req.file.size, 'bytes');

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const emotion = await getEmotion(buffer, mimeType);
    console.log('Detected emotion:', emotion);

    // Save to Prisma (skip if database not available)
    try {
      await prisma.emotionLog.create({ data: { emotion } });
      console.log('Saved to database');
    } catch (dbError) {
      console.warn('Database error (continuing anyway):', dbError.message);
    }

    res.json({ emotion });
  } catch (err) {
    console.error('Error analyzing emotion:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
