const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const mongoDBConnectionString =
  "mongodb+srv://derrickwillisca:mongodbpassword@task-manager.02l0k.mongodb.net/?retryWrites=true&w=majority&appName=task-manager";
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(mongoDBConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Mongoose Schema & Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
});

const Task = mongoose.model("Task", taskSchema);

// Routes
// Create Task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get Task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update Task
app.patch("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete Task - represents finishing the task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send("Task deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
