from flask import Flask, request, jsonify
from fastapi import FastAPI, HTTPException
from flask_cors import CORS
from agents.coordinator_agent import CoordinatorAgent
from fastapi import Request

app = FastAPI()
# CORS(app)

coordinator = CoordinatorAgent()
session_histories = {} # victor, remove history related codes for the deployment

@app.post("/interact")
async def interact(request: Request):
    data = await request.json()
    question = data.get("question", "").strip()
    session_id = data.get("session_id", "default")

    if not question:
        return {"error": "Please provide a question or symptoms"}

    if session_id not in session_histories:
        session_histories[session_id] = []
    session_histories[session_id].append({"role": "user", "content": question})

    response = coordinator.handle_conversation(question, history=session_histories[session_id])

    session_histories[session_id].append({"role": "assistant", "content": response})

    return {"message": response}

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)
