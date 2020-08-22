const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId (request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID'});
  }

  return next;
}

app.use('/projects/:id', validateProjectId);

app.get("/repositories", (request, response) => {
  const { title } = request.query;
});

app.post("/repositories", (request, response) => {
  // TODO
});

app.put("/repositories/:id", (request, response) => {
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id == id );

  if (projectIndex < 0){
      return response.status(400).json({error: 'Project not found.'})
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
