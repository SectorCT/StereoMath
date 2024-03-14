from openai import OpenAI
from dotenv import apiKey
client = OpenAI(api_key=apiKey)

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a mathematician and you are going to solve stereometry problems."},
    {"role": "user", "content": "Zadacha"},
    {"role": "system", "content": "You must give me the coordinates of the 3d figure in a 3d coordinate space. The output must be in JSON file."},
  ],
  stream=True
)

for chunk in completion:
  print(chunk.choices[0].delta)
