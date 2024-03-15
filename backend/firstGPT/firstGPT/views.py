import requests, os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from openai import OpenAI
from dotenv import load_dotenv
import json
from openai import OpenAI
from dotenv import apiKey
from regex_checks import r_check

load_dotenv()
client = OpenAI(api_key=apiKey)

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
    

@api_view(['POST'])
@csrf_exempt
def generate_text(request):
    if request.method == 'POST':
        data = request.POST.get('data', '')
        
        api_key = 'YOUR_API_KEY_HERE'
        
        endpoint = 'https://api.openai.com/v1/engines/davinci/completions'
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        
        payload = {
            'prompt': data,
            'max_tokens': 50
        }
        
        response = requests.post(endpoint, headers=headers, json=payload)
        
        if response.status_code == 200:
            return JsonResponse({'result': response.json()['choices'][0]['text']})
        else:
            return JsonResponse({'error': 'Failed to generate text'}, status=500)