from together import Together
from langchain.prompts import PromptTemplate
from .base_agent import BaseAgent
from .prompts import FIRST_AID_PROMPT
from config import TOGETHER_API_KEY


class FirstAidAgent(BaseAgent):
    def __init__(self):
        self.client = Together(api_key=TOGETHER_API_KEY)
        self.prompt_template = PromptTemplate(
            input_variables=["symptoms"],
            template=FIRST_AID_PROMPT
        )
        super().__init__(llm=None, tools=[])

    def handle_user_input(self, symptoms: str, history=None):
        prompt_text = self.prompt_template.format(symptoms=symptoms)

        messages = []
        if history:
            messages = history[:]
        messages.append({"role": "user", "content": symptoms})
        messages.append({"role": "system", "content": prompt_text})

        response = self.client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            messages=messages,
            temperature=0,
        )

        full_text = response.choices[0].message.content.strip()

        return {
            "advice": full_text,
            "symptoms": symptoms
        }
