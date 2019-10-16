const express = require('express');

const server = express();
server.use(express.json());
server.use(printNumberOfRequests);

const projects = [];
let numberOfRequests = 0;

//Routes
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  
  projects.push(project);
  return res.status(201)
            .set('Location', `${req.url}/${id}`)
            .json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;
  const project = projects[req.projectIndex];

  project.title = title; 
  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  projects.splice(req.projectIndex, 1);
  return res.status(204).end();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;  
  const project = projects[req.projectIndex];

  project.tasks.push(title); 
  return res.status(201)
            .set('Location', `${req.url}/${project.id}`)
            .json(project);
});

//Middlewares
function printNumberOfRequests(req, res, next) {
  console.log(`Requests made: ${++numberOfRequests}`);
  return next();
}

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if(projectIndex === -1)
    return res.status(404)
              .json({ error: "Project not found."})

  req.projectIndex = projectIndex;
  next();
}


server.listen(3000);