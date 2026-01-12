
import { useState, useCallback } from 'react';

export function useCustomChat({ api, body, initialMessages = [], onError }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    // Handle both event and direct string (just in case)
    const val = e && e.target ? e.target.value : e;
    setInput(val);
  };

  const append = useCallback(async (message) => {
    // Optimistically add user message
    const userMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: message.content 
    };
    
    // Update local state immediately
    let currentMessages = [];
    setMessages((prev) => {
        currentMessages = [...prev, userMessage];
        return currentMessages;
    });
    
    setIsLoading(true);
    setInput(''); // Clear input immediately

    try {
      // Evaluate body dynamically if it's a function (for fresh context)
      const requestBody = typeof body === 'function' ? body() : body;
      
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages, // Send full history including new message
          data: requestBody // Pass extra data like keys or context
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      // Parse simple JSON response instead of streaming
      const data = await response.json();
      
      // Add AI response to messages
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.text || ''
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
    } catch (err) {
      if (onError) onError(err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [api, body, onError]); // Removing 'messages' from dep array to avoid stale closures if using functional updaters correctly

  const handleSubmit = (e, options) => {
    if (e && e.preventDefault) e.preventDefault();
    append({ role: 'user', content: input });
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setInput,
    isLoading,
    setMessages
  };
}
