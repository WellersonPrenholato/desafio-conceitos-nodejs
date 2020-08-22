const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests( request, response, next ){
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); //Próximo middleware
  
  console.timeEnd(logLabel);
}

function validateProjectId (request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID'});
  }

  return next();
}

app.use(logRequests);
app.use('/repositories/:id', validateProjectId);

app.get("/repositories", logRequests, (request, response) => {
  const { title } = request.query;

    const results = title 
        ? repositories.filter( project => project.title.includes(title))
        : repositories;

    return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

    const project = {
      id: uuid(), 
      title, 
      url, 
      techs, 
      likes:0,
    };

    repositories.push(project);

    return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
    const { title, url, techs } = request.body;

    const projectIndex = repositories.findIndex(project => project.id == id );

    if (projectIndex < 0){
        return response.status(400).json({error: 'Project does not exists.'})
    }

    const project = {
        id,
        title,
        url,
        techs,
        likes: repositories[projectIndex].likes,
    };

    repositories[projectIndex] = project;

    return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id == id );

  if (projectIndex >= 0){
    repositories.splice(projectIndex, 1);
  }else {
    return response.status(400).json({error: 'Repository does not exists.'});
  }
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id == id );

    if (projectIndex < 0){
        return response.status(400).json({error: 'Project does not exists.'})
    }

    repositories[projectIndex].likes++;

    return response.json(repositories[projectIndex]);
});

module.exports = app;
