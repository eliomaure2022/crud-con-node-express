const express = require("express");
const res = require("express/lib/response");
const path = require("path");
const fs = require("fs/promises");

const app = express();

app.use(express.json());

const jsonPath = path.resolve("./file/tasks.json");

app.get("/tasks", async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, "utf-8");
  res.send(jsonFile);
});

app.post("/tasks", async (req, res) => {
  const task = req.body;
  //console.log(task);
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  //console.log(tasksArray);
  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1;
  tasksArray.push({ ...task, id: newId });
  console.log(tasksArray);
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  tasksArray.push(task);
  res.send("tarea agregada");
});

app.put("/tasks", async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  const { title, description, completed, id } = req.body;
  const taskIndex = tasksArray.findIndex((task) => task.id === id);
  //console.log(taskIndex);
  if (taskIndex >= 0) {
    // tasksArray[taskIndex].title = title;
    // tasksArray[taskIndex].description = description;
    tasksArray[taskIndex].completed = completed;
  }

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  console.log(tasksArray);

  res.send("tarea actualizada");
});

app.delete("/tasks", async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  const { id } = req.body;
  const taskIndex = tasksArray.findIndex((task) => task.id === id);
  tasksArray.splice(taskIndex, 1);

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.send("tarea eliminada");
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});
