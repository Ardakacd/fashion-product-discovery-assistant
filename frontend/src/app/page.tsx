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

  // Function to extract attributes from a query
  const extractAttributes = (query: string) => {
    const attributes: Record<string, any> = {};
    
    // Extract color
    const colorMatch = query.match(/(red|blue|green|black|white|yellow|purple|pink|orange|brown|grey|gray)/i);
    if (colorMatch) {
      attributes.color = colorMatch[0].toLowerCase();
    }
    
    // Extract brand
    const brandMatch = query.match(/(nike|adidas|puma|reebok|new balance|under armour|asics|converse|vans|zara|h&m|calvin klein|tommy hilfiger|gap|levi's|gucci|louis vuitton|chanel)/i);
    if (brandMatch) {
      attributes.brand = brandMatch[0];
    }
    
    // Extract category
    const categoryMatch = query.match(/(shoes|sneakers|running shoes|boots|sandals|shirt|t-shirt|blouse|dress|jeans|pants|trousers|shorts|skirt|jacket|coat|sweater|hoodie|swimwear|underwear|socks|hat|cap|scarf|watch|bracelet|necklace|earrings|ring)/i);
    if (categoryMatch) {
      attributes.category = categoryMatch[0];
    }
    
    // Extract size
    const sizeMatch = query.match(/size\s+(\d+(?:\.\d+)?|xs|s|m|l|xl|xxl)/i);
    if (sizeMatch) {
      attributes.size = sizeMatch[1];
    }
    
    // Extract price
    const priceMatch = query.match(/under\s+\$(\d+)/i) || query.match(/less than\s+\$(\d+)/i);
    if (priceMatch) {
      attributes.price = {
        max: parseInt(priceMatch[1])
      };
    }
    
    // More complex price range
    const priceRangeMatch = query.match(/between\s+\$(\d+)\s+and\s+\$(\d+)/i);
    if (priceRangeMatch) {
      attributes.price = {
        min: parseInt(priceRangeMatch[1]),
        max: parseInt(priceRangeMatch[2])
      };
    }
    
    return attributes;
  };

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
      // Extract attributes from query
      const extractedAttributes = extractAttributes(inputQuery);
      
      // Add thinking message
      setMessages(prev => [...prev, { role: 'assistant', content: 'Searching for products that match your request...' }]);
      
      // Call API with query and extracted attributes
      const response = await searchProducts({
        query: inputQuery,
        extracted_attributes: extractedAttributes,

        page: 1,
        limit: 12
      });
      
      // Update products
      setProducts(response.products);
      
      // Update assistant message with results
      setMessages(prev => {
        const newMessages = [...prev];
        // Replace the "thinking" message with the results message
        newMessages.pop();
        
        let responseMessage = '';
        if (response.products.length > 0) {
          responseMessage = `I found ${response.total} products matching your search for "${inputQuery}". Here are some options:`;
        } else {
          responseMessage = `I couldn't find any products matching "${inputQuery}". Try a different search or be less specific.`;
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