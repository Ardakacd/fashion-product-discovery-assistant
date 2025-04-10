import React, { FormEvent, RefObject } from 'react';
import { ChatMessage } from '../types/product';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (query: string) => void;
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  setInputValue,
  onSubmit,
  loading,
  messagesEndRef
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSubmit(inputValue);
  };

  const renderChatMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={index}
        className={`chat-bubble ${
          isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'
        }`}
      >
        {message.content}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary text-white font-semibold">
        Fashion Assistant
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 min-h-0">
        {messages.map(renderChatMessage)}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex gap-2 mt-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe what you're looking for..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
        <button
          type="submit"
          className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50"
          disabled={loading || !inputValue.trim()}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;