
import React from 'react';
import { useChat } from '@ai-sdk/react';

export default function TestChat() {
  const chat = useChat();
  console.log('TestChat chat object:', chat);
  
  return (
    <div className="p-4 bg-yellow-100 border border-yellow-500 m-4">
      <h3>Test Chat Component</h3>
      <p>Append type: {typeof chat.append}</p>
      <p>HandleInputChange type: {typeof chat.handleInputChange}</p>
      <button onClick={() => chat.append({ role: 'user', content: 'Hello' })} className="bg-blue-500 text-white p-2 rounded">
        Test Send
      </button>
    </div>
  );
}
