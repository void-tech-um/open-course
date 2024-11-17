# open-course
Repository for the Open Course project team within VOID Tech at the University of Michigan

### Getting Started

```sudo apt install postgresql``` to install PostgreSQL, this is needed for the next step.

```./bin/install``` to create a python virtual environment and install the related project dependencies.

### Running the Application
#### Start the virtual environment
```source env/bin/activate```

```./bin/ocRun``` to run the application on ```localhost:8000```

### Running the Application with Docker in the open-course-web-app repo
#### Run these commands once inside the open-course directory
```sudo docker build -t open-course .```
#### If the previous container is running, then stop it
#### Check current docker process with:
```sudo docker ps```
#### Using the container id, run this command:
```sudo docker stop <CONTAINER_ID>```
#### Run open-course application on port 8000
```sudo docker run --env-file .env -p 8000:8000 open-course```
