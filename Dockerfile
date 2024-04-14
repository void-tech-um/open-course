# Configuration for the Open Course website server Docker container
#
# VOID Tech (c) 2023 by VOID Tech
#

# Use minimal Python image
FROM python:3.8.2-slim-buster

# Set the working directory to /app
WORKDIR /open-course

# Update pip
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

# Copy the current directory contents.
COPY requirements.txt ./

# Install dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt
RUN pip install python-dotenv

# Copy the current directory contents into the container at /app
COPY . ./

# Make port 8000 available to the world outside this container
EXPOSE 8000

RUN pip install gunicorn
# Run website inside the container using gunicorn
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "application:app"]
