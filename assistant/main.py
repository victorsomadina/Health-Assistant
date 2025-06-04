from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Union
from utils import call_llama_api

app = FastAPI()

# A dict to keep conversation history keyed by user (or session ID)
conversation_memory = {}

class ChatRequest(BaseModel):
    name: str    
    role: str
    question: str
    transcript: Union[str, List[str]]

class ChatResponse(BaseModel):
    airesponse: str
@app.get("/")
def read_root():
    return {"status": "ok", "message": "API is up and running"}
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    user_key = request.name

    if user_key not in conversation_memory:
        conversation_memory[user_key] = []

    conversation_memory[user_key].append({"role": request.role, "content": request.question})

   
    max_memory = 10
    messages = conversation_memory[user_key][-max_memory:]

    try:
        answer = await call_llama_api(messages, request.transcript)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling LLaMA API: {e}")

    conversation_memory[user_key].append({"role": "assistant", "content": answer})

    return ChatResponse(airesponse=answer)