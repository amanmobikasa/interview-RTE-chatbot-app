import express from 'express';
import cors from 'cors';
import { generateText } from 'ai'; // Changed from streamText
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env from root
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// Normalize Google API key
if (process.env.GOOGLE_GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY =
    process.env.GOOGLE_GEMINI_API_KEY;
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, data } = req.body;
    const documentContext = data?.documentContext || '';

    const contextSystemMessage = {
      role: 'system',
      content: `You are a helpful document assistant.

The user is editing a document. Here is the current content:

--- DOCUMENT START ---
${documentContext}
--- DOCUMENT END ---

Answer questions based on this document if relevant. Be concise.`,
    };

    const finalMessages = [contextSystemMessage, ...messages];

    // Use generateText instead of streamText for complete response
    const result = await generateText({
      model: google('gemini-flash-latest'),
      messages: finalMessages,
    });

    // Return simple JSON response with the complete text
    res.status(200).json({
      message: result.text,
      role: 'assistant'
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message ?? 'Internal Server Error',
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AI Server running on http://localhost:${PORT}`);
});
