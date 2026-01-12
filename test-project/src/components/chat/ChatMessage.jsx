import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ChatMessage({ message }) {
  const isAi = message.role === 'ai';
  
  return (
    <div className={cn("flex gap-3", isAi ? "flex-row" : "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white",
        isAi ? "bg-blue-600" : "bg-gray-500"
      )}>
        {isAi ? <Bot size={16} /> : <User size={16} />}
      </div>
      
      <div className={cn(
        "p-4 rounded-2xl max-w-[85%] text-sm",
        isAi ? "bg-gray-100 rounded-tl-none text-gray-800" : "bg-blue-600 text-white rounded-tr-none"
      )}>
        {message.content}
        {message.timestamp && (
            <div className={cn("text-xs mt-2 opacity-70", isAi ? "text-gray-500" : "text-blue-100")}>
                {message.timestamp}
            </div>
        )}
      </div>
    </div>
  );
}
