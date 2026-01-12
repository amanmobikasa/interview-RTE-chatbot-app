import React from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChatContext } from '../../context/ChatContext';

export default function ChatSidebar() {
  const { messages, handleInputChange, handleSubmit, append } = useChatContext();

  const onSendSafe = (text) => {
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
