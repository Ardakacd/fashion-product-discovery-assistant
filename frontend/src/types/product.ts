export interface Product {
    id: string;
    name: string;
    brand?: string;
    category?: string;
    price?: number;
    currency?: string;
    image_url?: string;
    product_url?: string;
    color?: string;
    size?: string;
    source: string;
  }
  
  export interface ProductQueryRequest {
    query: string;
    extracted_attributes: Record<string, any>;
    filters?: Record<string, any>;
    page?: number;
    limit?: number;
  }
  
  export interface ProductSearchResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    query: string;
  }
  
  export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }