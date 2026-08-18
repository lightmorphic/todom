const express = require('express');
const fs = require('fs');
const path = require('path');
const { version } = require('./package.json');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || '/data/tasks.json';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/version', (req, res) => {
    res.json({ version });
});

function ensureDataFile() {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8');
    }
}

function loadTasks() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
        console.error('Error reading tasks file:', err);
        return [];
    }
}

function saveTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

app.get('/api/tasks', (req, res) => {
    res.json(loadTasks());
});

app.post('/api/tasks', (req, res) => {
    const { text, dueDate } = req.body;
    if (!text || !dueDate) {
        return res.status(400).json({ error: 'text and dueDate are required' });
    }
    const tasks = loadTasks();
    const newTask = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        text,
        dueDate,
        completed: false,
        completedDate: null
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const { text, dueDate, completed, completedDate } = req.body;
    if (text !== undefined) task.text = text;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completed !== undefined) task.completed = completed;
    if (completedDate !== undefined) task.completedDate = completedDate;
    saveTasks(tasks);
    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    const [deleted] = tasks.splice(index, 1);
    saveTasks(tasks);
    res.json(deleted);
});

app.post('/api/import', (req, res) => {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) {
        return res.status(400).json({ error: 'tasks must be an array' });
    }
    saveTasks(tasks);
    res.json({ success: true, count: tasks.length });
});

ensureDataFile();
app.listen(PORT, () => {
    console.log(`Todom server running on port ${PORT}, data file: ${DATA_FILE}`);
});
