import React from 'react';
import { Product } from '../types/product';
import ProductCard from './ProductCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  if (loading) {
    // Display loading skeletons while fetching products
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="product-card p-4">
              <Skeleton height={200} />
              <Skeleton count={2} className="mt-2" />
              <Skeleton width={80} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col justify-center items-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-center mb-2">No products found</h2>
        <p className="text-gray-600 text-center">
          Try searching for something else or check your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={`${product.source}-${product.id}`} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;