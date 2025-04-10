import axios from 'axios';
import { Product, ProductSearchResponse, ProductQueryRequest } from '../types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// Create axios instance with default configs
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY,
  },
});

/**
 * Search for products with the given query parameters
 */
export const searchProducts = async (queryParams: ProductQueryRequest): Promise<ProductSearchResponse> => {
  try {
    console.log(queryParams);
    const response = await apiClient.post('/api/search', queryParams);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Get detailed information about a product
 */
export const getProductDetails = async (productId: string, source: string): Promise<Product> => {
  try {
    const response = await apiClient.get(`/api/products/${productId}`, {
      params: { source },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching product details for ${productId}:`, error);
    throw error;
  }
};

/**
 * Get product recommendations based on a product
 */
export const getProductRecommendations = async (productId: string, source: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/api/products/${productId}/recommendations`, {
      params: { source },
    });
    return response.data.products;
  } catch (error) {
    console.error(`Error fetching recommendations for ${productId}:`, error);
    throw error;
  }
};