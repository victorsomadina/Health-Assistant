from typing import List, Any, Optional
from langchain.agents import initialize_agent
from langchain.agents.agent_types import AgentType
from langchain.llms.base import LLM
from langchain.tools import Tool


class BaseAgent:
    def __init__(
        self,
        llm: Optional[LLM] = None,
        tools: Optional[List[Tool]] = None,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose: bool = True
    ):
        self.llm = llm
        self.tools = tools or []
        self.agent = None
        if self.llm:
            self.agent = initialize_agent(
                tools=self.tools,
                llm=self.llm,
                agent=agent_type,
                verbose=verbose
            )

    def run(self, input_data: str) -> Any:
        if not self.agent:
            raise RuntimeError(
                "No agent initialized: Provide an LLM to enable run(), "
                "or override this method in your subclass."
            )
        return self.agent.run(input_data)
