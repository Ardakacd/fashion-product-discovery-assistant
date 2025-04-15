'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import ProductGrid from '../components/ProductGrid';
import Header from '../components/Header';
import { Product } from '../types/product';
import { searchProducts } from '../services/api';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { 
      role: 'assistant', 
      content: 'Hi there! I\'m your fashion discovery assistant. Tell me what you\'re looking for, like "red Nike running shoes under $100" or "blue denim jacket size medium", and I\'ll help you find it!' 
    }
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (inputQuery: string) => {
    if (!inputQuery.trim()) return;
    
    // Update messages with user query
    setMessages(prev => [...prev, { role: 'user', content: inputQuery }]);
    setQuery('');
    setLoading(true);
    
    try {
    
      // Add thinking message
      setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);
      
      // Call API with query and extracted attributes
      const response = await searchProducts({
        query: inputQuery, 
      });
      
      // Update products
      setProducts(response.products);
      
      // Update assistant message with results
      setMessages(prev => {
        const newMessages = [...prev];
        // Replace the "thinking" message with the results message
        newMessages.pop();
        
        let responseMessage = '';
        if (response.tool_used){
            if (response.products.length > 0) {
                responseMessage = `I found ${response.total} products matching your search for "${inputQuery}". Here are some options:`;
              } else {
                responseMessage = `I couldn't find any products matching "${inputQuery}". Try a different search or be less specific.`;
              }
        }else{
            responseMessage = response.llm_response
        }
        
        
        newMessages.push({ role: 'assistant', content: responseMessage });
        return newMessages;
      });
      
    } catch (error) {
      console.error('Error searching products:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        // Replace the "thinking" message with the error message
        newMessages.pop();
        newMessages.push({ role: 'assistant', content: 'Sorry, I had trouble finding products. Please try again.' });
        return newMessages;
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1 p-4 gap-4">
        {/* Chat interface - fixed height with scrolling */}
        <div className="md:w-1/3 flex flex-col md:h-[calc(100vh-100px)]">
          <div className="flex-1 flex flex-col mb-4">
            <ChatInterface 
              messages={messages} 
              inputValue={query}
              setInputValue={setQuery}
              onSubmit={handleSubmit}
              loading={loading}
              messagesEndRef={messagesEndRef}
            />
          </div>
          </div>
        
        {/* Product display */}
        <div className="md:w-2/3 md:h-[calc(100vh-100px)] md:overflow-y-auto">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}