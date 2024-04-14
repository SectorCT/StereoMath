import re
"""
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

open_ai_api_key = os.getenv("open_ai_api_key")
le_format = os.getenv("le_format")

client = OpenAI(api_key=open_ai_api_key)

test = "Дадена е правилна четириъгълна призма ACBDA1B1C1D1 с основен ръб Ab = 3 и околен ръб AA1 = 4. Намерете косинуса на ъгъл между AD1 и BC."

prompt = [
    {"role": "system", "content": "You are a mathematical assistant and you are going to work on stereometry qustions."},
    {"role": "user", "content": test},
    {"role": "user", "content": \
     "Дай ми координатите на върховете на фигурата в JSON формат (Форматът за JSON файла е: {le_format}) и кои двойки точки се свързват в отсечки. Отговори само с JSON файла без нищо друго. На английски език."},
]

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=prompt,
  max_tokens = 300
  #stream=True
)
"""
def r_check(api_response):
    pattern = r'(([A-Z]\d*),(-?\d+(\.\d+)?,*){3})+\;(([A-Z]\d*),)+([A-Z]\d*)(\,|\.|\;)*'

    if re.fullmatch(pattern, api_response):
        #print(api_response)
        print("Pattern matched.")
        return 0
    else:
        print("Pattern not matched.")
        return -1

def r_solution_check(solution):
    pattern = r'\[\W*(\"[^\[\]\{\}]*\",*)*\W*\]'

    if re.match(pattern, solution):
        print("Solution pattern matched.")
        return 0
    else:
        print("Solution pattern not matched.")
        return -1

#r_check("A,-0,0,0,B,3,0,0,C,1.5,sqrt(15)/2,0,Q,1.5,sqrt(15)/2,4")