import requests, os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from openai import OpenAI
from dotenv import load_dotenv
import json
from openai import OpenAI
from regex_checks import r_check

load_dotenv()

api_key = os.getenv("api_key")
le_format = os.getenv("le_format")

client = OpenAI(api_key=api_key)

@api_view(['POST'])
@csrf_exempt
def solution(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    
    problem = jsonBody['problem']
    if not problem:
        return JsonResponse({'success': False, 'message': 'Problem is missing'}, status=400)

    for i in range(6):
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a mathematical assistant and you are going to work on stereometry qustions."},
                {"role": "user", "content": problem},
                {"role": "user", "content": \
                "Дай ми координатите на върховете на фигурата в JSON формат и кои двойки точки се свързват в отсечки. Отговори само с JSON файла без нищо друго. На английски език в този формат: {le_format}"},
            ],
            max_tokens = 300
        )
        # Format check
        check = r_check(completion.choices[0].message.content)
        if check == 0:
            break
        # ends here
    # Completion test
    if(completion.choices[0].finish_reason == "stop"):
        return JsonResponse({'success': True, 'coordinates': completion.choices[0].message.content}, status=200)
    else:
        return JsonResponse({'success': False, 'coordinates': "Response not available"}, status=500)
    # ends here
    