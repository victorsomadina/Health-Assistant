import json
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_together import ChatTogether
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
from uuid import uuid4
from dotenv import load_dotenv
from datetime import timedelta
import uuid
from faker import Faker
from livekit import api
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Literal, Optional, Dict, Any

from together import Together


load_dotenv()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


fake = Faker()


client = Together(api_key=os.getenv("TOGETHER_API_KEY"))


@app.get("/api/livekit-token")
async def get_livekit_token():
    try:
        room_name = f"prepAI-{uuid.uuid4().hex[:6]}"
        token = generate_livekit_token(room_name)
        return {"token": token, "room": room_name}
    except Exception as e:
        return {"error": str(e)}

def generate_livekit_token(room: str = None) -> str:
    if not room:
        room = f"prepAI-{uuid.uuid4().hex[:6]}"
    token = (
        api.AccessToken(os.getenv('LIVEKIT_API_KEY'), os.getenv('LIVEKIT_API_SECRET'))
        .with_identity(uuid.uuid4().hex)
        .with_name(fake.name())
        .with_ttl(timedelta(minutes=5))
        .with_grants(api.VideoGrants(
            room_join=True,
            room=room,
            can_publish=True,
            can_subscribe=True,
            can_publish_data=True
        ))
    )
    return token.to_jwt()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)



















# import json
# import logging
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from langchain_together import ChatTogether
# from langchain.prompts import ChatPromptTemplate
# from langchain_core.output_parsers import StrOutputParser
# import os
# from uuid import uuid4
# from dotenv import load_dotenv
# from datetime import timedelta
# import uuid
# from faker import Faker
# from livekit import api
# from pydantic import BaseModel, Field, ConfigDict
# from typing import List, Literal, Optional, Dict, Any
# from prompt import (
#     ESSAY_PROMPT, COMPREHENSION_PROMPT, BATCH_QUESTION_PROMPTS,
#     ENHANCED_ESSAY_GRADING_PROMPT, COMPREHENSION_GRADING_PROMPT
# )
# from together import Together
# from pyngrok import ngrok, conf

# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Configure ngrok
# try:
#     # Get ngrok authtoken from environment variable
#     ngrok_auth_token = os.getenv("NGROK_AUTH_TOKEN")
#     if not ngrok_auth_token:
#         logger.warning("NGROK_AUTH_TOKEN not found in environment variables. Please set it to use ngrok.")
#     else:
#         # Set the authtoken
#         conf.get_default().auth_token = ngrok_auth_token
#         logger.info("Ngrok configured successfully")
# except Exception as e:
#     logger.error(f"Failed to configure ngrok: {str(e)}")



# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     expose_headers=["*"]
# )

# # Initialize components
# fake = Faker()

# # Initialize Together client
# client = Together(api_key=os.getenv("TOGETHER_API_KEY"))

# # NEW: Models for receiving data from your friend's database
# class DatabaseSubject(BaseModel):
#     name: str

# class DatabaseTopic(BaseModel):
#     name: str

# class DatabaseQuestion(BaseModel):
#     question: Optional[str] = None
#     level: int
#     answer: Optional[str] = None
#     subject: DatabaseSubject
#     topic: DatabaseTopic
#     options: List[str] = []
#     context: Optional[str] = None
#     usedMock: bool = True
#     content: Optional[str] = None  # Alternative field name for question
#     correct_answer: Optional[str] = None  # Alternative field name for answer

# class DatabaseRequest(BaseModel):
#     questions: List[DatabaseQuestion]
#     count: Optional[int] = 5  # How many questions to generate

# # NEW: Response model for sending back generated questions
# class GeneratedQuestion(BaseModel):
#     id: str = Field(default_factory=lambda: str(uuid4()))
#     question: str
#     level: int
#     answer: str
#     subject: DatabaseSubject
#     topic: DatabaseTopic
#     options: List[str] = []
#     type: str
#     generated_by_ai: bool = True

# class GeneratedQuestionsResponse(BaseModel):
#     questions: List[GeneratedQuestion]
#     total_generated: int
#     success: bool = True

# # Base Models (keep existing ones)
# class BaseQuestion(BaseModel):
#     id: str = Field(default_factory=lambda: str(uuid4()), 
#                    description="Unique identifier for the question")
#     type: str = Field(description="Type of question (Oral English, Lexis and Structure, etc.)")

# # MCQ Question Models (keep existing)
# class MCQQuestion(BaseQuestion):
#     question: str = Field(description="The question text for multiple choice question")
#     options: List[str] = Field(min_items=4, max_items=4,
#                              description="List of 4 options for the multiple choice question")
#     answer: str = Field(description="The correct answer from the options list")

# class MCQBatch(BaseModel):
#     questions: List[MCQQuestion] = Field(description="List of multiple choice questions")
#     model_config = ConfigDict(
#         extra="ignore"  # Ignore extra fields that might come from the API
#     )

# # Essay Models (keep existing)
# class EssayQuestion(BaseQuestion):
#     question: str = Field(description="The essay prompt or question")
#     answer: str = Field(description="Model answer that would earn full marks")

# class EnhancedEssayEvaluation(BaseModel):
#     score: float = Field(ge=0, le=100, description="Percentage score (0-100) for the essay")
#     feedback: str = Field(description="Brief summary of the essay performance")
#     answer: str = Field(description="The model answer for reference")
#     highlighted_answer: str = Field(description="The student's essay with HTML markup to highlight errors")
#     error_summary: List[dict] = Field(description="List of error objects with details about each error")

# # Comprehension Models (keep existing)
# class ComprehensionQuestionItem(BaseModel):
#     question: str = Field(description="A comprehension question about the passage")
#     answer: str = Field(description="Correct answer for the comprehension question")

# class ComprehensionQuestion(BaseQuestion):
#     passage: str = Field(description="Reading passage for comprehension questions")
#     questions: List[ComprehensionQuestionItem] = Field(min_items=5, max_items=5,
#                                                      description="List of 5 questions about the passage")

# class ComprehensionEvaluation(BaseModel):
#     score: int = Field(ge=0, le=5, description="Score out of 5 for the comprehension answer")
#     correct_answer: str = Field(description="The correct answer for reference")

# # Response Models for better API documentation
# class ErrorResponse(BaseModel):
#     error: str = Field(description="Error message")
#     success: bool = Field(default=False, description="Success status")

# # Helper function to map topic names to question types
# def map_topic_to_question_type(topic_name: str) -> str:
#     """Map database topic names to our internal question types"""
#     topic_mapping = {
#         "grammar": "Grammar",
#         "oral": "Oral English", 
#         "lexis": "Lexis and Structure",
#         "structure": "Lexis and Structure",
#         "essay": "Essay",
#         "comprehension": "Comprehension",
#         "oral english": "Oral English",
#         "lexis and structure": "Lexis and Structure"
#     }
#     return topic_mapping.get(topic_name.lower(), "Grammar")  # Default to Grammar

# def create_context_from_database_questions(db_questions: List[DatabaseQuestion]) -> str:
#     """Create context string from database questions for LLM"""
#     context_parts = []
    
#     for db_q in db_questions:
#         question_text = db_q.question or db_q.content or ""
#         answer_text = db_q.answer or db_q.correct_answer or ""
        
#         if question_text:
#             context_parts.append(f"Question: {question_text}")
#         if answer_text:
#             context_parts.append(f"Answer: {answer_text}")
#         if db_q.options:
#             context_parts.append(f"Options: {', '.join(db_q.options)}")
#         context_parts.append("---")
    
#     return "\n".join(context_parts)

# # NEW: Main endpoint for your friend to send questions and receive generated ones
# @app.post("/api/generate-from-database")
# async def generate_questions_from_database(request: DatabaseRequest):
#     """
#     Endpoint for your friend to send database questions and receive AI-generated similar questions
#     """
#     try:
#         if not request.questions:
#             raise HTTPException(status_code=400, detail="No questions provided")
        
#         # Get the first question to determine the type and subject
#         first_question = request.questions[0]
#         question_type = map_topic_to_question_type(first_question.topic.name)
#         subject_name = first_question.subject.name
#         count = request.count or 5
        
#         # Create context from the provided database questions
#         context = create_context_from_database_questions(request.questions)
        
#         generated_questions = []
        
#         if question_type in ["Oral English", "Lexis and Structure", "Grammar"]:
#             # Generate MCQ questions
#             batch_result = await generate_mcq_batch_with_context(question_type, context, count)
            
#             if isinstance(batch_result, MCQBatch) and batch_result.questions:
#                 for mcq in batch_result.questions:
#                     generated_q = GeneratedQuestion(
#                         question=mcq.question,
#                         level=first_question.level,
#                         answer=mcq.answer,
#                         subject=first_question.subject,
#                         topic=first_question.topic,
#                         options=mcq.options,
#                         type=question_type
#                     )
#                     generated_questions.append(generated_q)
#             else:
#                 raise HTTPException(status_code=500, detail="Failed to generate MCQ questions")
                
#         elif question_type == "Essay":
#             # Generate Essay questions
#             for i in range(count):
#                 essay_result = await generate_essay_with_context(context)
#                 if isinstance(essay_result, EssayQuestion):
#                     generated_q = GeneratedQuestion(
#                         question=essay_result.question,
#                         level=first_question.level,
#                         answer=essay_result.answer,
#                         subject=first_question.subject,
#                         topic=first_question.topic,
#                         options=[],
#                         type=question_type
#                     )
#                     generated_questions.append(generated_q)
                    
#         elif question_type == "Comprehension":
#             # Generate Comprehension questions
#             for i in range(count):
#                 comp_result = await generate_comprehension_with_context(context)
#                 if isinstance(comp_result, ComprehensionQuestion):
#                     # Convert comprehension format to match database format
#                     questions_text = f"Passage: {comp_result.passage}\n\nQuestions:\n"
#                     answers_text = "Answers:\n"
                    
#                     for j, comp_q in enumerate(comp_result.questions, 1):
#                         questions_text += f"{j}. {comp_q.question}\n"
#                         answers_text += f"{j}. {comp_q.answer}\n"
                    
#                     generated_q = GeneratedQuestion(
#                         question=questions_text,
#                         level=first_question.level,
#                         answer=answers_text,
#                         subject=first_question.subject,
#                         topic=first_question.topic,
#                         options=[],
#                         type=question_type
#                     )
#                     generated_questions.append(generated_q)
        
#         return GeneratedQuestionsResponse(
#             questions=generated_questions,
#             total_generated=len(generated_questions),
#             success=True
#         )
        
#     except Exception as e:
#         logging.error(f"Database question generation failed: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

# async def generate_mcq_batch_with_context(question_type: str, context: str, count: int):
#     """Generate MCQ questions using provided context"""
#     try:
#         if question_type not in BATCH_QUESTION_PROMPTS:
#             raise ValueError(f"Invalid question type: {question_type}")
            
#         batch_prompt = BATCH_QUESTION_PROMPTS[question_type].format(
#             context=context,
#             count=count
#         )
        
#         response = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": f"""You are a WAEC English exam question generator. Generate EXACTLY {count} {question_type} questions in strict JSON format.
#                     IMPORTANT FORMATTING INSTRUCTIONS:
#                     1. For questions that refer to underlined words, like "Choose the word nearest in meaning to the underlined word...", 
#                     DO NOT underline the word "underlined" in the instruction.
#                     2. Only underline the specific word being tested in the sentence, like:
#                     "The ornament should be handled with care because it is <u>fragile</u>."
#                     """
#                 },
#                 {
#                     "role": "user",
#                     "content": batch_prompt
#                 }
#             ],
#             model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
#             response_format={
#                 "type": "json_object",
#                 "schema": MCQBatch.model_json_schema()
#             },
#             temperature=0
#         )
        
#         raw_content = response.choices[0].message.content
#         data = json.loads(raw_content)
        
#         if "questions" not in data or not isinstance(data["questions"], list):
#             raise ValueError("Invalid response format: missing 'questions' array")
        
#         mcq_questions = []
#         for question_dict in data["questions"]:
#             question_dict["id"] = str(uuid4())
#             question_dict["type"] = question_type
#             mcq_question = MCQQuestion(**question_dict)
#             mcq_questions.append(mcq_question)
        
#         return MCQBatch(questions=mcq_questions)
        
#     except Exception as e:
#         logging.error(f"MCQ generation with context failed: {str(e)}")
#         return None

# async def generate_essay_with_context(context: str):
#     """Generate Essay question using provided context"""
#     try:
#         formatted_prompt = ESSAY_PROMPT.format(context=context)
        
#         response = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": """You are a WAEC English exam question generator. Generate output in strict JSON format."""
#                 },
#                 {
#                     "role": "user",
#                     "content": formatted_prompt
#                 }
#             ],
#             model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
#             response_format={
#                 "type": "json_object",
#                 "schema": EssayQuestion.model_json_schema()
#             },
#             temperature=0
#         )
        
#         data = json.loads(response.choices[0].message.content)
#         question = EssayQuestion(**data)
#         question.type = "Essay"
#         return question
        
#     except Exception as e:
#         logging.error(f"Essay generation with context failed: {str(e)}")
#         return None

# async def generate_comprehension_with_context(context: str):
#     """Generate Comprehension question using provided context"""
#     try:
#         formatted_prompt = COMPREHENSION_PROMPT.format(context=context)
        
#         response = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": """You are a WAEC English exam question generator. Generate output in strict JSON format."""
#                 },
#                 {
#                     "role": "user",
#                     "content": formatted_prompt
#                 }
#             ],
#             model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
#             response_format={
#                 "type": "json_object",
#                 "schema": ComprehensionQuestion.model_json_schema()
#             },
#             temperature=0
#         )
        
#         data = json.loads(response.choices[0].message.content)
#         question = ComprehensionQuestion(**data)
#         question.type = "Comprehension"
#         return question
        
#     except Exception as e:
#         logging.error(f"Comprehension generation with context failed: {str(e)}")
#         return None

# # Keep all your existing endpoints unchanged
# @app.get("/api/question")
# async def get_question(type: Literal["Oral English", "Lexis and Structure", "Grammar", "Essay", "Comprehension"]):
#     try:
#         # For MCQ-type questions, redirect to batch endpoint and return only the first question
#         if type in ["Oral English", "Lexis and Structure", "Grammar"]:
#             batch_result = await get_batch_questions(type, count=1)
            
#             if isinstance(batch_result, MCQBatch) and batch_result.questions:
#                 return batch_result.questions[0]
#             else:
#                 raise ValueError(f"Failed to get {type} question from batch endpoint")
        
#         # Handle Essay and Comprehension with empty context since we're not using RAG anymore
#         context = f"Generate a typical WAEC {type} question for English Language practice"
        
#         if type == "Essay":
#             schema = EssayQuestion.model_json_schema()
#             formatted_prompt = ESSAY_PROMPT.format(context=context)
#         else:
#             schema = ComprehensionQuestion.model_json_schema()
#             formatted_prompt = COMPREHENSION_PROMPT.format(context=context)
        
#         response = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": """You are a WAEC English exam question generator. Generate output in strict JSON format."""
#                 },
#                 {
#                     "role": "user",
#                     "content": formatted_prompt
#                 }
#             ],
#             model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
#             response_format={
#                 "type": "json_object",
#                 "schema": schema
#             },
#             temperature=0
#         )
        
#         data = json.loads(response.choices[0].message.content)
#         if type == "Essay":
#             question = EssayQuestion(**data)
#         else:
#             question = ComprehensionQuestion(**data)
        
#         question.type = type
#         return question
        
#     except Exception as e:
#         logging.error(f"Question generation failed: {str(e)}")
#         return {"error": str(e), "success": False}

# @app.get("/api/questions/batch")
# async def get_batch_questions(type: Literal["Oral English", "Lexis and Structure", "Grammar"], count: int = 5):
#     try:
#         # Use generic context since we're not using RAG anymore
#         context = f"Generate {count} diverse {type} questions on English Language for WAEC practice"
        
#         if type not in BATCH_QUESTION_PROMPTS:
#             return ErrorResponse(error=f"Invalid question type: {type}", success=False)
            
#         batch_prompt = BATCH_QUESTION_PROMPTS[type].format(
#             context=context,
#             count=count
#         )
        
#         response = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": f"""You are a WAEC English exam question generator. Generate EXACTLY {count} {type} questions in strict JSON format.
#                     IMPORTANT FORMATTING INSTRUCTIONS:
#                     1. For questions that refer to underlined words, like "Choose the word nearest in meaning to the underlined word...", 
#                     DO NOT underline the word "underlined" in the instruction.
#                     2. Only underline the specific word being tested in the sentence, like:
#                     "The ornament should be handled with care because it is <u>fragile</u>."
#                     """
#                 },
#                 {
#                     "role": "user",
#                     "content": batch_prompt
#                 }
#             ],
#             model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
#             response_format={
#                 "type": "json_object",
#                 "schema": MCQBatch.model_json_schema()
#             },
#             temperature=0
#         )
        
#         try:
#             raw_content = response.choices[0].message.content
#             data = json.loads(raw_content)
            
#             if "questions" not in data or not isinstance(data["questions"], list):
#                 raise ValueError("Invalid response format: missing 'questions' array")
                
#             if len(data["questions"]) != count:
#                 logging.warning(f"Expected {count} questions, but received {len(data['questions'])}")
            
#             mcq_questions = []
#             for question_dict in data["questions"]:
#                 question_dict["id"] = str(uuid4())
#                 question_dict["type"] = type
#                 mcq_question = MCQQuestion(**question_dict)
#                 mcq_questions.append(mcq_question)
            
#             batch = MCQBatch(questions=mcq_questions)
#             return batch
            
#         except json.JSONDecodeError as json_err:
#             logging.error(f"JSON Parsing Error: {str(json_err)}")
#             logging.error(f"Raw content: {raw_content[:500]}...")
#             return ErrorResponse(error="Question generation produced invalid JSON", success=False)
        
#     except Exception as e:
#         logging.error(f"Batch question generation failed: {str(e)}")
#         return ErrorResponse(error=str(e), success=False)

# # Keep all other existing endpoints (essay checking, comprehension checking, livekit, etc.) unchanged
# @app.post("/api/check_essay")
# async def check_essay(request_data: dict):
#     try:
#         question = request_data.get("question", "").strip()
#         user_answer = request_data.get("user_answer", "").strip()
#         answer = request_data.get("answer", "").strip()
        
#         is_copied_question = False
#         if not user_answer:
#             is_copied_question = True
#         elif question and user_answer:
#             normalized_question = ' '.join(question.lower().split())
#             normalized_answer = ' '.join(user_answer.lower().split())
            
#             if normalized_answer == normalized_question or \
#                (len(normalized_answer) < 100) or \
#                normalized_question in normalized_answer and len(normalized_answer) < len(normalized_question) * 1.2:
#                 is_copied_question = True
        
#         if is_copied_question:
#             return {
#                 "score": 0,
#                 "feedback": "The response appears to be either empty or simply a copy of the question. Please write an original answer to receive a proper evaluation.",
#                 "answer": answer,
#                 "highlighted_answer": f"<span class='error' data-error-type='Content Issue' data-suggestion='Write an original essay instead of copying the question prompt' data-correction='[Your original essay content should go here]'>{user_answer}</span>",
#                 "error_summary": [
#                     {
#                         "error_text": user_answer or "[Empty submission]",
#                         "error_type": "Content Issue",
#                         "suggestion": "Write an original essay instead of copying the question prompt",
#                         "correction": "Start with a proper greeting and write an original response addressing the prompt requirements"
#                     }
#                 ]
#             }
        
#         response = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": ENHANCED_ESSAY_GRADING_PROMPT.format(
#                         question=question,
#                         answer=answer,
#                         user_answer=user_answer
#                     )
#                 }
#             ],
#             model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
#             response_format={
#                 "type": "json_object",
#                 "schema": EnhancedEssayEvaluation.model_json_schema()
#             },
#             temperature=0
#         )
        
#         try:
#             raw_content = response.choices[0].message.content
#             data = json.loads(raw_content)
#             return EnhancedEssayEvaluation(**data)
#         except json.JSONDecodeError as json_err:
#             logging.error(f"JSON Parsing Error: {str(json_err)}")
#             logging.error(f"Raw content: {raw_content[:500]}...")
            
#             return {
#                 "error": "Essay evaluation produced invalid JSON. Please try again.", 
#                 "score": 0, 
#                 "success": False,
#                 "feedback": "Error processing your answer. The system encountered a formatting issue. Please try submitting again.",
#                 "answer": request_data.get("answer", ""),
#                 "highlighted_answer": request_data.get("user_answer", ""),
#                 "error_summary": []
#             }
            
#     except Exception as e:
#         logging.error(f"Essay checking failed: {str(e)}")
#         return {
#             "error": str(e), 
#             "score": 0, 
#             "success": False,
#             "feedback": "Error processing your answer. Please try again.",
#             "answer": request_data.get("answer", ""),
#             "highlighted_answer": request_data.get("user_answer", ""),
#             "error_summary": []
#         }

# @app.post("/api/check_comprehension")
# async def check_comprehension(request_data: dict):
#     try:
#         question_index = request_data.get("question_index", 0)
#         questions = request_data["questions"]
        
#         response = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": COMPREHENSION_GRADING_PROMPT.format(
#                         passage=request_data["passage"],
#                         question=questions[question_index]["question"],
#                         correct_answer=questions[question_index]["answer"],
#                         user_answer=request_data["user_answer"]
#                     )
#                 },
#                 {
#                     "role": "user",
#                     "content": "Grade this comprehension response"
#                 }
#             ],
#             model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
#             response_format={
#                 "type": "json_object",
#                 "schema": ComprehensionEvaluation.model_json_schema()
#             },
#             temperature=0
#         )
        
#         data = json.loads(response.choices[0].message.content)
#         return ComprehensionEvaluation(**data)
#     except Exception as e:
#         logging.error(f"Comprehension checking failed: {str(e)}")
#         return {"error": str(e), "score": 0, "success": False}

# # LiveKit endpoints remain unchanged
# @app.get("/api/livekit-token")
# async def get_livekit_token():
#     try:
#         room_name = f"prepAI-{uuid.uuid4().hex[:6]}"
#         token = generate_livekit_token(room_name)
#         return {"token": token, "room": room_name}
#     except Exception as e:
#         return {"error": str(e), "success": False}

# def generate_livekit_token(room: str = None) -> str:
#     if not room:
#         room = f"prepAI-{uuid.uuid4().hex[:6]}"
#     token = (
#         api.AccessToken(os.getenv('LIVEKIT_API_KEY'), os.getenv('LIVEKIT_API_SECRET'))
#         .with_identity(uuid.uuid4().hex)
#         .with_name(fake.name())
#         .with_ttl(timedelta(minutes=5))
#         .with_grants(api.VideoGrants(
#             room_join=True,
#             room=room,
#             can_publish=True,
#             can_subscribe=True,
#             can_publish_data=True
#         ))
#     )
#     return token.to_jwt()
# if __name__ == "__main__":
#     import uvicorn
    
#     # Start ngrok tunnel
#     try:
#         if ngrok_auth_token:
#             # Open a ngrok tunnel to the HTTP server
#             public_url = ngrok.connect(7000).public_url
#             logger.info(f"ngrok tunnel opened at: {public_url}")
#             logger.info("Share this URL with your partner to connect to your local server")
#         else:
#             logger.warning("Skipping ngrok tunnel creation - NGROK_AUTH_TOKEN not configured")
#     except Exception as e:
#         logger.error(f"Failed to start ngrok tunnel: {str(e)}")
    
#     # Start the FastAPI server
#     uvicorn.run(app, host="0.0.0.0", port=7000)