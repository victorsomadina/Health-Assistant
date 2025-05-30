import httpx
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

async def call_llama_api(messages: List[dict], transcript: str | List[str]) -> str:
    url = "https://api.together.xyz/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.getenv('TOGETHER_API_KEY')}",
        "Content-Type": "application/json"
    }

    if isinstance(transcript, list):
        transcript = "\n".join(transcript)

    system_prompt = (
        "You are a helpful assistant. Use the following transcript to answer the user's questions "
        "based strictly on the transcript. Do not hallucinate or provide info outside the transcript. "
        "Keep responses professional and clear."
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
