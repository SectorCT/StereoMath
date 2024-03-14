import requests, os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from openai import OpenAI
from dotenv import load_dotenv
import json
from openai import OpenAI
from dotenv import apiKey

load_dotenv()
client = OpenAI(api_key=apiKey)

@api_view(['POST'])
@csrf_exempt
def solution(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    
    problem = jsonBody['problem']
    if not problem:
        return JsonResponse({'success': False, 'message': 'Problem is missing'}, status=400)
    
    # The request
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a mathematician and you are going to solve stereometry problems."},
            {"role": "user", "content": "Zadacha"},
            {"role": "system", "content": "You must give me the coordinates of the 3d figure in a 3d coordinate space. The output must be in JSON file."},
        ],
        stream=True
        )
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