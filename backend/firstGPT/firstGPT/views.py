import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from openai import OpenAI


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