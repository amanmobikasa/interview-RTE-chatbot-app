# Rich Text Editor & AI Chat Assistant

A dual-pane web application featuring a rich text editor with simulated content streaming and an AI-powered chat assistant that contextually understands your document.

## Features

- **Rich Text Editor**:
  - Tiptap-based editor with formatting options (Bold, Italic, Underline, Alignments).
  - **Streaming Simulation**: Content appears incrementally to simulate real-time data loading.
  - **Save**: Logs document content to the console.
- **Preview & Export**:
  - View a read-only preview of your document.
  - Simulated "Download as Word" and "Download as PDF" actions.
- **AI Chat Assistant**:
  - Powered by **Google Gemini** (via Vercel AI SDK).
  - **Context-Aware**: The AI can read your current document content and answer questions about it.
  - **Real-time**: Custom chat hook implementation for robust communication.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **Google Gemini API Key**: You need a valid API key from [Google AI Studio](https://aistudio.google.com/).

## Installation

1.  **Clone the repository** (if applicable) or navigate to the project folder.

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Setup**:
    - Create a `.env` file in the root directory.
    - Add your Google Gemini API Key:
      ```env
      GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
      ```

## Running the Application

This project requires both a frontend (Vite) and a backend (Express) server to run simultaneously.

1.  **Start the Backend Server**:
    The backend handles API requests to Google Gemini.

    ```bash
    npx nodemon server/server.js
    ```

    _You should see: "AI Server running on http://localhost:3001"_

2.  **Start the Frontend**:
    Open a new terminal window and run:
    ```bash
    npm run dev
    ```
    _Access the app at the URL shown (e.g., http://localhost:5173)_

## Usage Guide

1.  **Editor**: Start typing in the left pane or wait for the "streaming" content to finish loading. Use the toolbar to format text.
2.  **Chat**: Open the sidebar on the right. Ask the AI questions like "Summarize this document" or "What is the Effective Date?".
    - _Note_: The AI receives the current content of your editor every time you send a message.
3.  **Preview**: Click the "Preview" button in the header to see the final document layout.
4.  **Save**: Click "Save" to persist changes (currently logs to console).

## Troubleshooting

- **AI Not Responding?**
  - Check if the backend server (`server/server.js`) is running.
  - Verify your `GOOGLE_GEMINI_API_KEY` in the `.env` file is correct and has credits/quota.
  - Check the terminal for error logs.
- **"Model not found" Error?**
  - Google changes model names occasionally. Check `server/server.js` and ensure the model name (e.g., `gemini-1.5-flash`, `gemini-pro`) matches a currently available model.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Tiptap, Lucide React
- **Backend**: Node.js, Express
- **AI**: Vercel AI SDK, Google Generative AI
