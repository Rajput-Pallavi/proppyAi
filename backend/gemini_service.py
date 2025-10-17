import os
# Suppress gRPC warnings
os.environ["GRPC_VERBOSITY"] = "NONE"
os.environ["GRPC_TRACE"] = ""

import google.generativeai as genai
from typing import Optional

class GeminiAssistant:
    def __init__(self, api_key: str):
        """
        Initialize the Gemini Assistant
        
        Args:
            api_key (str): Your Gemini API key
        """
        # Configure Gemini API
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-001')
        
        # Configure for faster responses
        self.generation_config = genai.types.GenerationConfig(
            max_output_tokens=150,  # Limit response length for speed
            temperature=0.7,
            top_p=0.8,
            top_k=20
        )
    
    def get_gemini_response(self, prompt: str) -> str:
        """
        Get response from Gemini API with 3-line limit
        
        Args:
            prompt (str): User's input prompt
            
        Returns:
            str: Processed response limited to 3 lines
        """
        try:
            enhanced_prompt = f"Think yourself as a school teacher Radha and use polite for before answering like intresting question or else so sweet. say the main point in easy way, dont use much. then according to the prompo Answer. Give in deep answer when needed, please try to restrict to 3 lines and only use more when neccessary:{prompt}"
            
            response = self.model.generate_content(
                enhanced_prompt,
                generation_config=self.generation_config
            )
            
            if response.text:
                # Split response into lines and limit to 3
                lines = response.text.strip().split('\n')
                limited_response = '\n'.join(lines[0:])
                print("\n--- Gemini Response ---")
                print(limited_response)
                print("-----------------------\n")
                return limited_response
            else:
                return "I couldn't generate a response. Please try again."
                
        except Exception as e:
            return f"Error: {str(e)}"
    
    def process_prompt(self, prompt: str) -> dict:
        """
        Process the user prompt and return structured response
        
        Args:
            prompt (str): User's input prompt
            
        Returns:
            dict: Structured response with status and data
        """
        try:
            # Get response from Gemini
            response = self.get_gemini_response(prompt)
            
            return {
                'status': 'success',
                'result': response,
                'query': prompt,
                'error': None
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'result': None,
                'query': prompt,
                'error': str(e)
            }

# Factory function to create assistant instance
def create_gemini_assistant(api_key: str) -> Optional[GeminiAssistant]:
    """
    Create and return a Gemini Assistant instance
    
    Args:
        api_key (str): Gemini API key
        
    Returns:
        GeminiAssistant or None if initialization fails
    """
    try:
        assistant = GeminiAssistant(api_key)
        print("✅ Gemini Assistant initialized successfully!")
        return assistant
    except Exception as e:
        print(f"❌ Error initializing Gemini Assistant: {str(e)}")
        return None