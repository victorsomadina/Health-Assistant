import httpx
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

async def call_llama_api(messages: List[dict], transcript: str | List[str]) -> str:
    url = os.getenv('TOGETHER_API_URL')
    headers = {
        "Authorization": f"Bearer {os.getenv('TOGETHER_API_KEY')}",
        "Content-Type": "application/json"
    }

    if isinstance(transcript, list):
        transcript = "\n".join(transcript)

    system_prompt = (
        "You are a helpful health assistant. Use the following transcript to answer the user's questions "
        "based strictly on the transcript. Do not hallucinate or provide info outside the transcript. "
        "Keep responses professional and clear." 
        "if the transcript is empty, respond with 'No relevant information found in the transcript.'"
        "if the query does not relate to the transcript, respond with 'I don't have enough information to answer your question at this point in time. \
        if you have any questions not related to a past conversation, please start a new conversation.'"
        "if the query is not related to healthcare, respond with 'I can only assist with healthcare-related questions.'"
    )

    together_messages = [
        {"role": "system", "content": system_prompt},
        *messages,
        {"role": "user", "content": f"Transcript:\n{transcript}"}
    ]

    payload = {
        "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "messages": together_messages,
        "max_tokens": 256,
        "temperature": 0.7,
        "top_p": 0.9,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise Exception(f"HTTP error: {e.response.status_code} - {e.response.text}")
        
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
