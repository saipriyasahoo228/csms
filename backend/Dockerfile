# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set the working directory
WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && apt-get clean

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements.txt
COPY requirements.txt /code/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /code/

# Expose port 8000 for the application
EXPOSE 8000

# Set the entrypoint command to run the Django server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "EMS.wsgi:application"]
