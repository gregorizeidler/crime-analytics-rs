"""Main FastAPI application for Crime Analytics Chatbot."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime

from config import settings
from gpt_agent import get_agent
from database import db_manager

# Create FastAPI app
app = FastAPI(
    title="Crime Analytics Chatbot API",
    description="API para chatbot de análise de dados de crimes do RS",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    success: bool
    message: str
    conversation_id: str
    function_calls: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None


class ConversationResetRequest(BaseModel):
    conversation_id: str


class DatabaseInfoResponse(BaseModel):
    schema: Dict[str, Any]
    statistics: Dict[str, Any]
    sample_data: List[Dict[str, Any]]


# API Endpoints
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Crime Analytics Chatbot API",
        "version": "1.0.0",
        "description": "API para análise de dados de crimes do RS com GPT",
        "endpoints": {
            "POST /chat": "Enviar mensagem para o chatbot",
            "POST /reset": "Resetar conversa",
            "GET /database/info": "Obter informações sobre o banco de dados",
            "GET /health": "Verificar status da API"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Test database connection
        stats = db_manager.get_statistics()
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected",
            "total_records": stats.get("total_records", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the chatbot and get a response.
    
    Args:
        request: ChatRequest with message and optional conversation_id
        
    Returns:
        ChatResponse with the assistant's reply
    """
    try:
        # Generate or use existing conversation ID
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Get agent for this conversation
        agent = get_agent(conversation_id)
        
        # Process message
        result = agent.chat(request.message)
        
        if result["success"]:
            return ChatResponse(
                success=True,
                message=result["message"],
                conversation_id=conversation_id,
                function_calls=result.get("function_calls")
            )
        else:
            return ChatResponse(
                success=False,
                message=result.get("message", "Erro ao processar mensagem"),
                conversation_id=conversation_id,
                error=result.get("error")
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/reset")
async def reset_conversation(request: ConversationResetRequest):
    """
    Reset a conversation.
    
    Args:
        request: ConversationResetRequest with conversation_id
        
    Returns:
        Success message
    """
    try:
        agent = get_agent(request.conversation_id)
        agent.reset_conversation()
        
        return {
            "success": True,
            "message": "Conversa resetada com sucesso",
            "conversation_id": request.conversation_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/database/info", response_model=DatabaseInfoResponse)
async def get_database_info():
    """
    Get information about the database.
    
    Returns:
        Database schema, statistics, and sample data
    """
    try:
        schema = db_manager.get_table_schema()
        statistics = db_manager.get_statistics()
        sample_data = db_manager.get_sample_data(limit=5)
        
        return DatabaseInfoResponse(
            schema=schema,
            statistics=statistics,
            sample_data=sample_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/statistics")
async def get_statistics():
    """Get basic statistics about the crime data."""
    try:
        stats = db_manager.get_statistics()
        return {
            "success": True,
            "statistics": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.backend_host,
        port=settings.backend_port,
        reload=True
    )

