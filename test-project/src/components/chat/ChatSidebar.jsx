import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
// import { useChat } from '@ai-sdk/react'; // Broken in this env
import { useCustomChat } from '../../hooks/useCustomChat'; 
import { useEditorContext } from '../../context/EditorContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatSidebar() {
  const { editor } = useEditorContext();
  
  // Using custom hook to avoid storage/browser restrictions
  const { messages, input, handleInputChange, handleSubmit, append } = useCustomChat({
    api: `http://localhost:3001/api/chat`,
    body: () => ({
      documentContext: editor ? editor.getHTML() : '',
    }),
    initialMessages: [
         { id: 'welcome', role: 'assistant', content: 'Add effective date as 10 Jan 2026' }
    ],
    onError: (err) => console.error('Chat error:', err)
  });

  const onSendSafe = (text) => {
      // With custom hook, append is always defined
      append({ role: 'user', content: text });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Document Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={{...msg, role: msg.role === 'assistant' ? 'ai' : 'user', timestamp: 'Just now'}} />
        ))}
      </div>
      
      <ChatInput onSend={onSendSafe} />
    </div>
  );
}
