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
  }
  
  export interface ProductSearchResponse {
    products: Product[];
    total: number;
    llm_response: string;
    tool_used: boolean;
  }
  
  export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }