# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# Run the Django development server
CMD ["gunicorn", "--chdir", "app", "stereomath.wsgi:application", "--bind", "0.0.0.0:8000"]
