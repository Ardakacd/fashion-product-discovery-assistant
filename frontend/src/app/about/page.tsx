'use client';

import React from 'react';
import Header from '../../components/Header';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">About Fashion Discovery Assistant</h1>
          
          <p className="mb-4">
            The Fashion Product Discovery Assistant is an intelligent tool designed to help you find the perfect fashion items using natural language. Simply tell our assistant what you're looking for, and we'll search across multiple retailers to find the best matches.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">Describe What You Want</h3>
              <p className="text-gray-600">Use natural language to tell our assistant exactly what you're looking for.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">Smart Search</h3>
              <p className="text-gray-600">Our AI extracts relevant details and searches across multiple retailers.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">👕</div>
              <h3 className="text-lg font-medium mb-2">Find Perfect Matches</h3>
              <p className="text-gray-600">Browse through curated results that match your specific requirements.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Supported Retailers</h2>
          
          <p className="mb-6">
            We search across multiple fashion retailers to find the best products for you:
          </p>
          
          <ul className="list-disc pl-5 mb-8 space-y-2">
            <li>Rakuten - Wide variety of fashion items from Japanese and international brands</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Example Searches</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="italic text-gray-700">Try searches like:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>"Red Nike running shoes under $100"</li>
              <li>"Black leather jacket size medium"</li>
              <li>"Blue denim jeans from Levi's"</li>
              <li>"Casual summer dresses under $50"</li>
              <li>"Men's formal shirts with slim fit"</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-500 mt-8">
            Fashion Product Discovery Assistant is a project built with Next.js, React, and FastAPI.
          </p>
        </div>
      </div>
    </div>
  );
}