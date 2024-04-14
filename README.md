# open-course
Repository for the Open Course project team within VOID Tech at the University of Michigan

### Getting Started
```./bin/install``` to create a python virtual environment and install the related project dependencies.

### Running the Application
#### Start the virtual environment
```source env/bin/activate```

```./bin/ocRun``` to run the application on ```localhost:8000```

### Running the Application with Docker in the open-course-web-app repo
```sudo docker build -t open-course .```

```sudo docker run --env-file .env -p 8000:8000 open-course```
