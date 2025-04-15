'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ProductGrid from '../../components/ProductGrid';
import { Product } from '../../types/product';
import { searchProducts } from '../../services/api';

// Categories for trending products
const TRENDING_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'shoes', name: 'Shoes' },
  { id: 'dresses', name: 'Dresses' },
  { id: 'jackets', name: 'Jackets' },
  { id: 'accessories', name: 'Accessories' }
];

export default function Trending() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      setLoading(true);
      try {
        // Create query based on selected category
        const query = selectedCategory === 'all' 
          ? 'trending fashion products' 
          : `trending ${selectedCategory}`;
          
        const extractedAttributes: Record<string, any> = {};
        if (selectedCategory !== 'all') {
          extractedAttributes.category = selectedCategory;
        }
        
        const response = await searchProducts({
          query,
        });
        
        setProducts(response.products);
      } catch (error) {
        console.error('Error fetching trending products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingProducts();
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Trending Fashion</h1>
          <p className="text-gray-600">
            Discover the hottest fashion trends that are popular right now.
          </p>
        </div>
        
        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TRENDING_CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Products grid */}
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}