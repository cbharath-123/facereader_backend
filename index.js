require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { getEmotion } = require('./geminiService');

const app = express();
const prisma = new PrismaClient();

const upload = multer({ storage: multer.memoryStorage() });

// Allow CORS from frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://facereader-frontend.vercel.app',
  'https://facereader-frontend-*.vercel.app' // Vercel preview deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  credentials: true
}));
app.use(express.json());

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const emotion = await getEmotion(buffer, mimeType);

    // Save to Prisma
    await prisma.emotionLog.create({ data: { emotion } });

    res.json({ emotion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
