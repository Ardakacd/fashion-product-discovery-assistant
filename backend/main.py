from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import requests
import os
from fastapi.security import APIKeyHeader
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import MessagesState, StateGraph, START
from langgraph.prebuilt import tools_condition
from langgraph.prebuilt import ToolNode
from constants import SYSTEM_MESSAGE
import ast

load_dotenv(override=True)

app = FastAPI(title="Fashion Product Discovery API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key security
API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)


API_KEYS = {
    "rakuten": os.getenv("RAKUTEN_API_KEY", ""),
}

# Models

class ProductQuery(BaseModel):
    query: str

class PriceFilter(BaseModel):
    min_price: Optional[float] = None
    max_price: Optional[float] = None


class RakutenProductQuery(BaseModel):
    query: str
    prices: Optional[PriceFilter] = None
    limit: int = 10


class Product(BaseModel):
    id: str
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = "USD"
    image_url: Optional[str] = None
    product_url: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None
    source: str  # Which API provided this product

class ProductResponse(BaseModel):
    products: List[Product]
    total: int
    llm_response: str
    tool_used: bool

# Auth dependency
async def verify_api_key(api_key: str = Depends(api_key_header)):
    if api_key != os.getenv("API_KEY", "fashion_discovery_default_key"):
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

# Routes
@app.get("/")
async def root():
    return {"message": "Fashion Product Discovery API is running!"}

@app.post("/api/search", response_model=ProductResponse)
async def search_products(query: ProductQuery):
    """
    Search for fashion products across multiple APIs based on the provided query
    """
    # Gather products from all supported APIs
    products = []
    total_products = 0
    
    llm = ChatOpenAI(model="gpt-4o")
    
    llm_with_tools = llm.bind_tools([search_rakuten])
    
    sys_msg = SystemMessage(content=SYSTEM_MESSAGE)  # Node
    
    async def assistant(state: MessagesState):
        return {"messages": [await llm_with_tools.ainvoke([sys_msg] + state["messages"])]}
        
    builder = StateGraph(MessagesState)  # Define nodes: these do the work
    builder.add_node("assistant", assistant)
    builder.add_node("tools", ToolNode([search_rakuten]))
    
    # Define edges: these determine how the control flow moves
    builder.add_edge(START, "assistant")
    builder.add_conditional_edges(
        "assistant",
        # If the latest message (result) from assistant is a tool call -> tools_condition routes to search_rakuten
        # If the latest message (result) from assistant is a not a tool call -> tools_condition routes to END
        tools_condition,
    )
    graph = builder.compile()
    
    human_message = [HumanMessage(content=query.query)]
    result = await graph.ainvoke({"messages": human_message})


    # Check if the LLM used the tool or just returned a message
    tool_used = False
    llm_response = ""
    
    
    # Extract the last message to check if it's from a tool or the assistant
    if result and "messages" in result and result["messages"]:
        last_message = result["messages"][-1]

        
        # Check if we got products from the search_rakuten tool
        if hasattr(last_message, 'tool_call_id') and last_message.tool_call_id:
            tool_used = True
            print(last_message.content)
            
            # Get the products from the tool call result
            try:
                tool_content = eval(last_message.content)
                products.extend(tool_content)
            except:
                print('Error while getting product contents')
            
                
        else:
            # If no tool was used, capture the LLM's text response
            llm_response = last_message.content
    
    total_products = len(products)
    
    return ProductResponse(
        products=products,
        total=total_products,
        llm_response=llm_response,  # Include the LLM response in the return
        tool_used=tool_used  # Flag to indicate if a tool was used
    )
        
    

async def search_rakuten(query: RakutenProductQuery) -> List[Product]:
    """
    Search for products using the Rakuten API
    query.query should include just the important keywords such as category, brand, color etc
    query.prices should includes the prices information given by the user it could have min_price or max_price as a key
    query.limit should indicate how many items does user wants, if he/she does not specify then default value is 10
    """
    products = []
    
    try:    
        search_term = query.query
    
        max_price = query.prices.max_price if query.prices else None
        min_price = query.prices.min_price if query.prices else None
        
        # Example Rakuten API endpoint (using RapidAPI)
        url = "https://rakuten_webservice-rakuten-marketplace-item-search-v1.p.rapidapi.com/IchibaItem/Search/20170706"
        
        params = {
            "keyword": search_term,
            "hits": query.limit,
            "availability": 1,
            "imageFlag": 1,
        }
        if min_price is not None:
            params["minPrice"] = min_price

        if max_price is not None:
            params["maxPrice"] = max_price 

    
        headers = {
            "x-rapidapi-key": API_KEYS["rakuten"],
            "x-rapidapi-host": "rakuten_webservice-rakuten-marketplace-item-search-v1.p.rapidapi.com"
        }


        response = requests.get(url, params=params, headers=headers, verify=False)

        
        
        if response.status_code == 200:
            data = response.json()

            # Transform Rakuten data to our Product model
            for item in data.get("Items", []):
                product = item.get("Item", {})
                

                products.append(
                    Product(
                        id=str(product.get("itemCode", "")),
                        name=product.get("itemName", ""),
                        brand=product.get("shopName", ""),  
                        category=product.get("genreName", ""),
                        price=float(product.get("itemPrice", 0)),
                        currency="JPY",  # Rakuten uses Japanese Yen
                        image_url=product.get("mediumImageUrls", [{"imageUrl":{}}])[0]["imageUrl"],
                        product_url=product.get("itemUrl", ""),
                        source="rakuten"
                    )
                )
                    
    except Exception as e:
        print(f"Error searching Rakuten: {str(e)}")
            
    return products


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)