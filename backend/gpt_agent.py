"""GPT Agent with function calling for SQL queries."""
import json
from typing import List, Dict, Any, Optional
from openai import OpenAI
from database import db_manager
from config import settings


class CrimeAnalyticsAgent:
    """Agent that uses GPT to answer questions about crime data."""
    
    def __init__(self):
        import os
        import httpx
        os.environ["OPENAI_API_KEY"] = settings.openai_api_key
        
        # Create custom httpx client without proxies
        http_client = httpx.Client(
            timeout=60.0,
            limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
        )
        
        self.client = OpenAI(http_client=http_client)
        self.conversation_history: List[Dict[str, Any]] = []
        
        # Get database schema and statistics on initialization
        self.schema = db_manager.get_table_schema()
        self.statistics = db_manager.get_statistics()
        self.sample_data = db_manager.get_sample_data(limit=3)
        
        # Define system prompt with context
        self.system_prompt = self._create_system_prompt()
    
    def _create_system_prompt(self) -> str:
        """Create a comprehensive system prompt with database context."""
        return f"""Você é um assistente especializado em análise de dados de crimes do Rio Grande do Sul (RS), Brasil.

SOBRE O BANCO DE DADOS:
- Tabela: defaultdb.public.raw_records
- Total de registros: {self.statistics.get('total_records', 'N/A')}
- Período dos dados: {self.statistics.get('earliest_year', 'N/A')} a {self.statistics.get('latest_year', 'N/A')}
- Municípios únicos: {self.statistics.get('total_municipalities', 'N/A')}
- Tipos de crimes únicos: {self.statistics.get('total_crime_types', 'N/A')}

COLUNAS DISPONÍVEIS:
{json.dumps([col['column_name'] for col in self.schema['columns']], indent=2)}

EXEMPLO DE DADOS:
{json.dumps(self.sample_data[:2], indent=2, ensure_ascii=False, default=str)}

INSTRUÇÕES:
1. Você pode responder perguntas sobre os dados de crimes do RS
2. Use a função 'execute_sql_query' para buscar dados quando necessário
3. Sempre crie queries SQL seguras (apenas SELECT)
4. Use PostgreSQL syntax
5. Formate respostas de forma clara e informativa em português
6. Inclua insights e análises quando relevante
7. Se não tiver certeza, peça esclarecimentos
8. Para queries complexas, explique o que está fazendo
9. Considere usar agregações (COUNT, AVG, SUM) e agrupamentos (GROUP BY) quando apropriado
10. Para análises temporais, use EXTRACT(YEAR FROM data_fato::date) ou similar

TIPOS DE PERGUNTAS QUE VOCÊ PODE RESPONDER:
- Estatísticas sobre crimes (totais, médias, tendências)
- Análises por município, bairro, tipo de crime
- Comparações temporais (anos, meses)
- Perfis de vítimas (idade, sexo, cor)
- Locais de ocorrência
- Horários de maior incidência

Seja prestativo, preciso e forneça insights valiosos sobre os dados!"""
    
    def _get_tools_definitions(self) -> List[Dict[str, Any]]:
        """Define available tools for GPT."""
        return [
            {
                "type": "function",
                "function": {
                    "name": "execute_sql_query",
                    "description": "Execute uma query SQL SELECT no banco de dados de crimes. Use esta função para buscar dados quando o usuário fizer uma pergunta que requer informações do banco de dados.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Query SQL SELECT a ser executada. Deve usar PostgreSQL syntax. Exemplo: SELECT COUNT(*) FROM defaultdb.public.raw_records WHERE EXTRACT(YEAR FROM data_fato::date) = 2024"
                            },
                            "explanation": {
                                "type": "string",
                                "description": "Breve explicação do que a query faz e porque você está executando-a"
                            }
                        },
                        "required": ["query", "explanation"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_database_info",
                    "description": "Obter informações sobre o banco de dados, incluindo schema, estatísticas e dados de exemplo.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "info_type": {
                                "type": "string",
                                "enum": ["schema", "statistics", "sample_data", "all"],
                                "description": "Tipo de informação a obter"
                            }
                        },
                        "required": ["info_type"]
                    }
                }
            }
        ]
    
    def execute_sql_query(self, query: str, explanation: str) -> Dict[str, Any]:
        """Execute a SQL query and return results."""
        # Validate query
        if not db_manager.validate_query(query):
            return {
                "success": False,
                "error": "Query não permitida. Apenas queries SELECT são permitidas."
            }
        
        try:
            results = db_manager.execute_query(query)
            return {
                "success": True,
                "explanation": explanation,
                "row_count": len(results),
                "data": results[:100]  # Limit to 100 rows for token efficiency
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_database_info(self, info_type: str) -> Dict[str, Any]:
        """Get database information."""
        if info_type == "schema":
            return {"schema": self.schema}
        elif info_type == "statistics":
            return {"statistics": self.statistics}
        elif info_type == "sample_data":
            return {"sample_data": self.sample_data}
        else:  # all
            return {
                "schema": self.schema,
                "statistics": self.statistics,
                "sample_data": self.sample_data
            }
    
    def chat(self, user_message: str, conversation_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a user message and return a response.
        
        Args:
            user_message: The user's question or message
            conversation_id: Optional conversation ID for maintaining context
            
        Returns:
            Dictionary with response and metadata
        """
        # Add user message to history
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        # Prepare messages for GPT
        messages = [
            {"role": "system", "content": self.system_prompt}
        ] + self.conversation_history
        
        try:
            # Initial GPT call
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=self._get_tools_definitions(),
                tool_choice="auto",
                temperature=0.7,
                max_tokens=2000
            )
            
            response_message = response.choices[0].message
            
            # Check if GPT wants to call a tool
            function_calls_made = []
            
            while response_message.tool_calls:
                tool_call = response_message.tool_calls[0]
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                # Execute the function
                if function_name == "execute_sql_query":
                    function_result = self.execute_sql_query(
                        function_args["query"],
                        function_args["explanation"]
                    )
                elif function_name == "get_database_info":
                    function_result = self.get_database_info(
                        function_args["info_type"]
                    )
                else:
                    function_result = {"error": "Unknown function"}
                
                function_calls_made.append({
                    "function": function_name,
                    "arguments": function_args,
                    "result": function_result
                })
                
                # Add tool call and result to conversation
                messages.append({
                    "role": "assistant",
                    "content": None,
                    "tool_calls": response_message.tool_calls
                })
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": function_name,
                    "content": json.dumps(function_result, default=str)
                })
                
                # Get next response from GPT
                response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    tools=self._get_tools_definitions(),
                    tool_choice="auto",
                    temperature=0.7,
                    max_tokens=2000
                )
                
                response_message = response.choices[0].message
            
            # Add assistant's final response to history
            assistant_message = response_message.content
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })
            
            return {
                "success": True,
                "message": assistant_message,
                "function_calls": function_calls_made,
                "conversation_length": len(self.conversation_history)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Desculpe, ocorreu um erro ao processar sua mensagem: {str(e)}"
            }
    
    def reset_conversation(self):
        """Reset the conversation history."""
        self.conversation_history = []


# Create agent instances for different conversations
agent_instances: Dict[str, CrimeAnalyticsAgent] = {}


def get_agent(conversation_id: str = "default") -> CrimeAnalyticsAgent:
    """Get or create an agent instance for a conversation."""
    if conversation_id not in agent_instances:
        agent_instances[conversation_id] = CrimeAnalyticsAgent()
    return agent_instances[conversation_id]

