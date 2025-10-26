const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;

async function getEmotion(imageBuffer, mimeType) {
  if (!API_KEY) {
    console.warn('GEMINI_API_KEY not set; returning Neutral as fallback');
    return 'Neutral';
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = 'Analyze the primary human emotion in this image. Respond with only a single word from these options: Happy, Sad, Angry, Neutral, Surprised.';

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return extractSingleWord(text);
  } catch (err) {
    console.error('Gemini API error:', err?.message || err);
    return 'Neutral';
  }
}

function extractSingleWord(text) {
  // Normalize and pick the first matching keyword
  const normalized = text.replace(/[^A-Za-z]/g, ' ').trim();
  const words = normalized.split(/\s+/).map(w => w.toLowerCase());
  const options = ['happy', 'sad', 'angry', 'neutral', 'surprised'];
  for (const w of words) {
    if (options.includes(w)) return capitalize(w);
  }
  // If none matched, return Neutral
  return 'Neutral';
}

function capitalize(w) {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

module.exports = { getEmotion };
