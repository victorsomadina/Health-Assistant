from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils import call_llama_api

app = FastAPI()

class ChatRequest(BaseModel):
    name: str
    role: str
    question: str
    transcript: str

class ChatResponse(BaseModel):
    airesponse: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    messages = [{"role": request.role, "content": request.question}]

    try:
        answer = await call_llama_api(messages, request.transcript)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling LLaMA API: {e}")

    return ChatResponse(airesponse=answer)
