"""
import os
from openai import OpenAI
from dotenv import load_dotenv
from regex_checks import r_check
from regex_checks import r_solution_check
import json

load_dotenv()

open_ai_api_key = os.getenv("open_ai_api_key")
le_format = os.getenv("le_format")

client = OpenAI(api_key=open_ai_api_key)

test = "Дадена е правилна четириъгълна призма ACBDA1B1C1D1 с основен ръб Ab = 3 и околен ръб AA1 = 4. Намерете косинуса на ъгъл между AD1 и BC."
test1 = "Дадена е првилна триъгълна пирамида ABCQ с основен ръб AB = 3 и околен ръб AQ = 4 и QH, като H е пресечната точка на диагоналите на основата. Намерете CH."

prompt = [
    {"role": "system", "content": "You are a mathematical assistant and you are going to work on stereometry qustions."},
    {"role": "user", "content": test1},
    {"role": "user", "content": \
     "Give me only the 3D coordinates of the figure and the corresponding vertex, separated by commas and without braces in one line without anything else. In this format: A,1,1,1,B,2,2,2. End with ; . After that print the pairs of vertices connected by a line, separated with commas without you adding text. End the prompt blank."},
]

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=prompt,
  max_tokens = 300
  #stream=True
)

solution = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a mathematical assistant and you are going to work on stereometry qustions."},
      {"role": "user", "content": test1},
      {"role": "user", "content": \
      "Дай ми стъпките на решението на задачата, обградени в [] средно дълго без да решаваш точните стойности само с обяснение обградено обяснено точка по точка като всяка точка е в отделние \"\"."}

  ],
  max_tokens = 1000
  #stream=True
)
"""
#text = "[\n  \"To solve this problem, we can use the properties of a regular triangular pyramid.\",\n  \"The key observation here is that the diagonals of the base of a regular triangular pyramid bisect each other at a right angle and meet at the centroid of the base.\",\n  \"Since the pyramid is regular, the centroid of the base is the midpoint of each diagonal.\",\n  \"Using the properties of a regular triangle, we can find the length of the diagonal of the base, which is 3√3.\",\n  \"Now, we can use the Pythagorean theorem in triangle AQH to find the height QH.\",\n  \"From triangle AQH, using Pythagorean theorem, we have (QH)^2 + (AH)^2 = AQ^2.\",\n  \"Substitute the values of AH (half the diagonal of the base) and AQ into the equation and solve for QH.\",\n  \"Once we have the value of QH, we can find CH by subtracting AH from it since CH = QH - AH, where AH = 3√3 / 2.\"\n]"
#r_solution_check(text)

#c_message = json.loads(text)
#s_message = json.loads(solution.choices[0].message.content)
#print(c_message)
"""
coords = completion.choices[0].message.content.replace(" ", "").replace("\n", "")
#completion.choices[0].message.content = coords
if(coords[-1] == '.'): coords = coords[:-1]
coords = coords.split(";")
print(completion.choices[0].message.content)
print(coords[0] + " " + coords[1])
r_check(completion.choices[0].message.content)
coords[0] = coords[0].split(",")
coords[1] = coords[1].replace(",", "")
print(coords[0])
print(coords[1])

t_coords = ""
t_connections = ""
for i in range(0, len(coords[1]), 2):
    t_connections += "[" + coords[1][i:i+2] + "],"

t_connections = "[" + t_connections[:-1] + "]"
print(t_connections)

for i in range(1, int(len(coords[0])/2), 2):
  coords[0][i] = "[" + ",".join(coords[0][i:i+3]) + "],"
  coords[0] = coords[0][:i+1] + coords[0][i+3:]
  print(coords[0])

coords[0][-1] = coords[0][-1][:-1]
for i in range(0, len(coords[0])-1, 2):
   t_coords += ":".join(coords[0][i:i+2])

t_coords = "{" + t_coords + "}"
print(t_coords)

coords[0] = t_coords
coords[1] = t_connections
print(coords)

result = "{ vertices: " + coords[0] + ", edges: " + coords[1] + "}"
print(result)
"""
def jsonFy(api_result):
    coords = api_result.replace(" ", "").replace("\n", "")
    if(coords[-1] == '.'): coords = coords[:-1]
    coords = coords.split(";")
    coords[0] = coords[0].split(",")
    coords[1] = coords[1].replace("-", ",").split(",")

    t_coords = ""
    t_connections = ""
    for i in range(0, len(coords[1]), 2):
        if i+1 < len(coords[1]): t_connections += "[\"" + coords[1][i] + "\",\"" + coords[1][i+1] + "\"],"

    t_connections = "[" + t_connections[:-1] + "]"

    for i in range(1, int(len(coords[0])/2), 2):
        coords[0][i] = "[" + ",".join(coords[0][i:i+3]) + "],"
        coords[0] = coords[0][:i+1] + coords[0][i+3:]

    coords[0][-1] = coords[0][-1][:-1]
    for i in range(0, len(coords[0])-1, 2):
        coords[0][i] = "\"" + coords[0][i] + "\""
        t_coords += ":".join(coords[0][i:i+2])

    t_coords = "{" + t_coords + "}"

    coords[0] = t_coords
    coords[1] = t_connections

    result = "{\"vertices\":" + coords[0] + ",\"edges\":" + coords[1] + "}"

    return result

#print("Check")
#print(jsonFy(completion.choices[0].message.content))
#r_solution_check(solution.choices[0].message.content)