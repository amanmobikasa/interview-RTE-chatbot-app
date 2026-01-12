
import express from 'express';
import cors from 'cors';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env from root
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// Ensure API key is set properly for the SDK
if (process.env.GOOGLE_GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
}

console.log('Environment check:');
console.log('GOOGLE_GENERATIVE_AI_API_KEY available:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
console.log('GOOGLE_GEMINI_API_KEY available:', !!process.env.GOOGLE_GEMINI_API_KEY);


const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, data } = req.body;
    const documentContext = data?.documentContext || '';

    // Create a system message with the document context if it's the first turn or just prepend context
    // Vercel AI SDK passes 'messages' array. We can just pass it to the model.
    // But we want to give the AI context about the document.
    
    const contextSystemMessage = {
      role: 'system',
      content: `You are a helpful document assistant. 
      The user is editing a document. Here is the current content of the document: 
      \n\n--- DOCUMENT START ---\n${documentContext}\n--- DOCUMENT END ---\n\n
      Answer questions based on this document context if relevant. Be concise.`
    };

    // Prepend system message if not present (or we can just use the 'system' option in streamText if supported by the model/sdk version, 
    // but message manipulation is safer compatible wise)
    const finalMessages = [contextSystemMessage, ...messages];

    const result = await streamText({
      model: google('models/gemini-1.5-flash-latest'), // Try generic latest for flash
      messages: finalMessages,
    });

    // Handle stream response for Express (Node.js)
    // streamText returns a result with toDataStream() which is a Web Stream
    // We need to convert it to a Node Stream to pipe to Express response
    const { Readable } = await import('stream');
    if (typeof result.toDataStream !== 'function') {
         console.warn('result.toDataStream is missing. Keys:', Object.keys(result));
         throw new Error('result.toDataStream is not a function. Check ai sdk version compatibility.');
    }

    const webStream = result.toDataStream();
    Readable.fromWeb(webStream).pipe(res);

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    // Extract upstream error message if available (e.g. from Google 404)
    const upstreamError = error.data || error;
    res.status(500).json({ 
        error: error.message || 'Internal Server Error', 
        details: error.toString(),
        upstream: upstreamError 
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AI Server running on http://localhost:${PORT}`);
});
