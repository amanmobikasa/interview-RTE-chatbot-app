import React, { createContext, useContext } from 'react';
import { useEditorContext } from './EditorContext';
import { useCustomChat } from '../hooks/useCustomChat';

const ChatContext = createContext(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { editor } = useEditorContext();

  const chat = useCustomChat({
    api: `http://localhost:3001/api/chat`,
    body: () => ({
      documentContext: editor ? editor.getHTML() : '',
    }),
    initialMessages: [
         { id: 'welcome', role: 'assistant', content: 'Add effective date as 10 Jan 2026' }
    ],
    onError: (err) => console.error('Chat error:', err)
  });

  return (
    <ChatContext.Provider value={chat}>
      {children}
    </ChatContext.Provider>
  );
};
