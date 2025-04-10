import React from 'react';
import Image from 'next/image';
import { Product } from '../types/product';
import { ShoppingBagIcon, HeartIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Determine currency symbol based on currency code
  const getCurrencySymbol = (currencyCode: string = 'USD') => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };
    return symbols[currencyCode] || '$';
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (price === undefined) return 'Price not available';
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${price.toFixed(2)}`;
  };

  // Placeholder image for products without images
  const defaultImage = 'https://via.placeholder.com/300x400?text=No+Image';

  return (
    <div className="product-card flex flex-col">
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image_url || defaultImage}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
          <HeartIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
        </button>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        {product.brand && (
          <p className="text-sm text-gray-600 font-medium uppercase">{product.brand}</p>
        )}
        
        <h3 className="text-base font-medium line-clamp-2 min-h-[3rem]">{product.name}</h3>
        
        <div className="mt-2 flex flex-col flex-1">
          {product.color && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Color:</span> {product.color}
            </p>
          )}
          
          {product.size && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Size:</span> {product.size}
            </p>
          )}
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-semibold text-primary-dark">
            {formatPrice(product.price, product.currency)}
          </p>
          
          <a 
            href={product.product_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-primary rounded-full shadow-sm hover:bg-primary-dark transition-colors"
          >
            <ShoppingBagIcon className="h-5 w-5 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;