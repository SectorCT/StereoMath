import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from openai import OpenAI
from dotenv import load_dotenv
import json
from openai import OpenAI
from .regex_checks import r_check
from .regex_checks import r_solution_check

load_dotenv()

open_ai_api_key = os.getenv("open_ai_api_key")
le_format = os.getenv("le_format")

client = OpenAI(api_key=open_ai_api_key)

api_key = os.getenv("api_key")
le_format = os.getenv("le_format")

@api_view(['POST'])
@csrf_exempt
def solution(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    
    problem = jsonBody['problem']
    if not problem:
        return JsonResponse({'success': False, 'message': 'Problem is missing'}, status=400)

    check_c = 1
    check_s = 1
    for i in range(6):
        solution = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a mathematical assistant and you are going to work on stereometry qustions."},
                {"role": "user", "content": problem},
                {"role": "user", "content": \
                 "Give me a brief explanation without calculating the actual values how to solve this question everything in JSON placed in [] and every paragraph placed in \"\""}
            ],
            max_tokens = 1000
            #stream=True
        )
        check_c = r_solution_check(solution.choices[0].message.content)
        if check_c == 0:
            break
    for i in range(6):
        completion = client.chat.completions.create(    
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a mathematical assistant and you are going to work on stereometry qustions."},
                {"role": "user", "content": problem},
                {"role": "user", "content": \
                "Give me the 3d coordinates of the figure and the pairs of vertices connected by a line without anything else in JSON in this format: {le_format}"},
            ],
            max_tokens = 300
        )
        # Format check
        check_s = r_check(completion.choices[0].message.content)
        if check_s == 0:
            break
        # ends here
    print(completion.choices[0].finish_reason)
    # Completion test
    if(completion.choices[0].finish_reason == "stop"):
        #c_message = json.loads(completion.choices[0].message.content)
        #s_message = json.loads(solution.choices[0].message.content)
        if(check_c != 0 or check_s != 0):
            return JsonResponse({'success': False, 'coordinates': 'Response not available', 'solution': 'Response not available'}, status=200)
        return JsonResponse({'success': True, 'coordinates': completion.choices[0].message.content, 'solution': solution.choices[0].message.content}, status=200)
    else:
        return JsonResponse({'success': False, 'coordinates': 'Response not available', 'solution': 'Response not available'}, status=500)
    # ends here
    