from openai import OpenAI
import os

# Configure OpenAI client
open_ai_api_key = os.getenv("open_ai_api_key")
client = OpenAI(api_key=open_ai_api_key)
print(open_ai_api_key)