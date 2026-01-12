
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
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages, // Send full history including new message
          data: body // Pass extra data like keys or context
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Initialize AI message
      let aiContent = '';
      const aiMessageId = (Date.now() + 1).toString();
      
      setMessages((prev) => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // The Vercel AI SDK 'streamText' sends protocol data: 0:"text"\n
        
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (!line) continue;
            
            // Format 0: "text"
            if (line.startsWith('0:')) {
                const jsonStr = line.slice(2);
                try {
                    // It's JSON stringified string, e.g. "Hello" -> remove quotes? No JSON.parse breaks it down.
                    // 0:"H" -> JSON.parse("H") = H
                    const text = JSON.parse(jsonStr);
                    aiContent += text;
                } catch (e) {
                   // console.warn('Failed to parse chunk', line);
                }
            } else {
                // Might be error or other parts.
                // If it's simple text mode (legacy), it might just be text.
                // But Vercel SDK v3+ usually uses protocol.
            }
        }
        
        // Update the last message
        setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
                lastMsg.content = aiContent;
            }
            return newMessages;
        });
      }
      
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
