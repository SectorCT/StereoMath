# StereoMath

Take a photo of a 3D geometry problem and get a step-by-step solution plus a 3D figure you can rotate and zoom.

Built by team Sector C at **Hack TUES X (2024), where it took 2nd place overall**, and kept in development until mid-2025.

## How it works

1. The app takes a photo of the problem (or picks one from the gallery).
2. Google Cloud Vision reads the text.
3. The Django server asks GPT-4 for two things: a worked solution, and the figure as structured data (vertices with x, y, z coordinates and the edges between them).
4. The server validates that structure, and the app renders the figure in 3D with Three.js next to the solution.

## Stack

| Part | Tech |
|---|---|
| App | React Native, Expo, TypeScript, Three.js via @react-three/fiber and expo-gl, expo-camera |
| Server | Django, Django REST Framework, PostgreSQL, OpenAI API, Google Cloud Vision |
| Deployment | Heroku (server), EAS (app builds) |

## Run locally

```bash
# server
pip install -r requirements.txt
# create .env with DJANGO_SECRET_KEY, DATABASE_URL, OPENAI_API_KEY and EXPO_PUBLIC_GOOGLE_API_KEY (Cloud Vision)
python manage.py migrate
python manage.py runserver

# app
cd client
npm install
# set EXPO_PUBLIC_API_URL to the server's address
npx expo start
```

There is also a Docker setup; see `procheti me.txt` for the commands.

## Team

| | Role |
|---|---|
| [Svetoslav Iliev](https://github.com/Svetoslav47) | React Native app and the 3D figure renderer |
| [Radoslav Dimitrov](https://github.com/RKDimitrov) | |
| [dr-programmer](https://github.com/dr-programmer) | |
| [Antonio Gotev](https://github.com/tonigotev) | |
| [Damyan Myashkov](https://github.com/DMyashkov) | |
