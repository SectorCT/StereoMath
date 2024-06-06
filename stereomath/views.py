import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from dotenv import load_dotenv
from openai import OpenAI
from .regex_checks import r_check, r_solution_check
from .request_tests import jsonFy
from django.http import JsonResponse, HttpResponseBadRequest
import io
import requests

# Load environment variables
load_dotenv()

# Configure OpenAI client
open_ai_api_key = os.environ.get('OPENAI_API_KEY', 'optional-default-value')
client = OpenAI(api_key=open_ai_api_key)

# Helper function to generate completions 
def generate_completion(client, problem, role_messages, model="gpt-4-turbo", max_tokens=1000):
    messages = [
        {"role": "system", "content": role_messages['system']},
        {"role": "user", "content": problem}
    ] + role_messages['user']

    return client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens
    )

@api_view(['POST'])
@csrf_exempt
def solution(request):
    json_body = json.loads(request.body.decode('utf-8'))
    problem = json_body.get('problem')

    if not problem:
        return JsonResponse({'success': False, 'message': 'Problem is missing'}, status=400)

    role_messages_solution = {
        'system': "You are a mathematical assistant and you are going to work on stereometry questions.",
        'user': [
            {"role": "user", "content": "Give me a brief explanation without calculating the actual values how to solve this question everything in JSON placed in [] and every paragraph placed in \"\""}
        ]
    }

    role_messages_coords = {
        'system': "You are a mathematical assistant and you are going to work on stereometry questions.",
        'user': [
            {"role": "user", "content": "Translate the question in english."},
            {"role": "user", "content": "Give me only the 3D coordinates of the figure and the corresponding vertex, separated by commas and without braces in one line without anything else. In this format: A,1,1,1,B,2,2,2. End with ; . After that show me which vertices connect to create an edge, separated with commas without you adding text. End the prompt blank."}
        ]
    }

    solution, coords_result = None, None

    for _ in range(6):
        solution = generate_completion(client, problem, role_messages_solution)
        if r_solution_check(solution.choices[0].message.content) == 0:
            break

    for _ in range(6):
        coords = generate_completion(client, problem, role_messages_coords, model="gpt-4-turbo")
        formatted_coords = coords.choices[0].message.content.replace(" ", "").replace("\n", "")
        if r_check(formatted_coords) == 0:
            coords_result = jsonFy(formatted_coords)
            break

    if coords.choices[0].finish_reason == "stop" and coords_result and solution:
        return JsonResponse({
            'success': True,
            'coordinates': coords_result,
            'solution': solution.choices[0].message.content
        }, status=200)
    else:
        return JsonResponse({
            'success': False,
            'coordinates': 'Response not available',
            'solution': 'Response not available'
        }, status=500)

@api_view(['POST'])
@csrf_exempt
def recognize_text(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            image_data = data['image']

            api_key = os.getenv('EXPO_PUBLIC_GOOGLE_API_KEY')
            if not api_key:
                return HttpResponseBadRequest("API key not found in environment variables")

            url = "https://vision.googleapis.com/v1/images:annotate"
            headers = {'Content-Type': 'application/json'}
            payload = {
                "requests": [
                    {
                        "image": {
                            "content": image_data
                        },
                        "features": [
                            {
                                "type": "TEXT_DETECTION"
                            }
                        ]
                    }
                ]
            }
            params = {'key': api_key}

            response = requests.post(url, headers=headers, params=params, json=payload)
            response_data = response.json()

            if response.status_code == 200 and 'responses' in response_data and response_data['responses'][0].get('textAnnotations'):
                text = response_data['responses'][0]['textAnnotations'][0]['description']
                return JsonResponse({'text': text})
            else:
                return JsonResponse({'text': ''}, status=400)

        except Exception as e:
            return HttpResponseBadRequest(f"Error processing image: {str(e)}")
    else:
        return HttpResponseBadRequest("Invalid request method. Please use POST.")
    
@api_view(['GET'])
def isAppPublished(request):
    return JsonResponse({"published": False, "URL": ""}, status = 200)