"""Database connection and query execution."""
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any
import json
from config import settings


class DatabaseManager:
    """Manager for database connections and queries."""
    
    def __init__(self):
        self.connection_params = {
            'host': settings.db_host,
            'database': settings.db_name,
            'user': settings.db_user,
            'password': settings.db_password,
            'port': settings.db_port
        }
    
    def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """
        Execute a SQL query and return results as a list of dictionaries.
        
        Args:
            query: SQL query to execute
            params: Query parameters (optional)
            
        Returns:
            List of dictionaries with query results
        """
        try:
            with psycopg2.connect(**self.connection_params) as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                    cursor.execute(query, params)
                    
                    # Check if query returns results
                    if cursor.description:
                        results = cursor.fetchall()
                        return [dict(row) for row in results]
                    return []
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def get_table_schema(self) -> Dict[str, Any]:
        """Get schema information for the raw_records table."""
        query = """
        SELECT 
            column_name,
            data_type,
            is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'raw_records'
        ORDER BY ordinal_position;
        """
        
        try:
            schema = self.execute_query(query)
            return {
                "table_name": "raw_records",
                "columns": schema
            }
        except Exception as e:
            raise Exception(f"Error fetching schema: {str(e)}")
    
    def get_sample_data(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Get sample data from the raw_records table."""
        query = f"""
        SELECT 
            sequencia,
            data_fato,
            hora_fato,
            grupo_fato,
            tipo_enquadramento,
            tipo_fato,
            municipio_fato,
            local_fato,
            bairro,
            quantidade_vitimas,
            idade_vitima,
            sexo_vitima,
            cor_vitima
        FROM defaultdb.public.raw_records
        LIMIT {limit};
        """
        
        return self.execute_query(query)
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get basic statistics about the dataset."""
        query = """
        SELECT 
            COUNT(*) as total_records,
            COUNT(DISTINCT municipio_fato) as total_municipalities,
            COUNT(DISTINCT grupo_fato) as total_crime_types,
            MIN(data_fato::date) as earliest_date,
            MAX(data_fato::date) as latest_date,
            EXTRACT(YEAR FROM MIN(data_fato::date)) as earliest_year,
            EXTRACT(YEAR FROM MAX(data_fato::date)) as latest_year
        FROM defaultdb.public.raw_records;
        """
        
        results = self.execute_query(query)
        return results[0] if results else {}
    
    def validate_query(self, query: str) -> bool:
        """
        Validate that a query is safe to execute.
        
        Args:
            query: SQL query to validate
            
        Returns:
            True if query is safe, False otherwise
        """
        # Convert to lowercase for checking
        query_lower = query.lower().strip()
        
        # Block dangerous operations
        dangerous_keywords = [
            'drop', 'delete', 'truncate', 'update', 
            'insert', 'alter', 'create', 'grant', 
            'revoke', 'execute'
        ]
        
        for keyword in dangerous_keywords:
            if keyword in query_lower:
                return False
        
        # Must be a SELECT query
        if not query_lower.startswith('select'):
            return False
        
        return True


# Create a singleton instance
db_manager = DatabaseManager()

