# Fashion Product Discovery Assistant

A conversational AI assistant that helps users discover fashion products using natural language queries. Built with Next.js, FastAPI, and more.

## 🎯 Project Overview

The Fashion Product Discovery Assistant interprets natural language queries like "red Nike running shoes under $100" to extract key product attributes (brand, color, size, price, etc.), query multiple fashion retailer APIs, and present relevant results in a user-friendly interface.

## 🧩 Tech Stack

### 🧑‍🎨 Frontend (Next.js)
- **React & Next.js**: Modern, server-side rendered UI
- **Tailwind CSS**: Utility-first CSS framework for custom design
- **Axios**: HTTP client for API requests
- **React Loading Skeleton**: For loading state placeholders
- **Heroicons**: Beautiful SVG icons

### 🚀 Backend (FastAPI)
- **FastAPI**: High-performance Python web framework
- **Pydantic**: Data validation and settings management
- **python-dotenv**: Environment variable management

## 🌟 Features

- **Conversational Interface**: Natural language input for product searches
- **Advanced Attribute Extraction**: Parses colors, brands, sizes, prices, and more
- **Multi-API Integration**: Searches across Rakuten
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Feedback**: Shows "thinking" states during searches

## 📋 Project Structure

```
fashion-product-discovery/
├── backend/
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Environment variables (not in repo)
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx     # Home page
    │   │   ├── about/       # About page
    │   │   └── trending/    # Trending products
    │   ├── components/      # React components
    │   ├── services/        # API services
    │   └── types/           # TypeScript interfaces
    ├── public/              # Static assets
    ├── package.json         # Node dependencies
    └── .env.local           # Environment variables (not in repo)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- API keys for fashion retailers

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your API keys:
   ```
   API_KEY=your_api_key_for_your_client
   RAKUTEN_API_KEY=your_rakuten_api_key
   ```

5. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_API_KEY=your_api_key_for_your_client
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🤖 LangGraph Integration

LangGraph is integrated to power the agent side of the application, enabling more advanced conversational capabilities and memory.
