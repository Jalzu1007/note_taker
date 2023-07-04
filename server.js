const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbFilePath = path.join(__dirname, 'db', 'db.json');

// Read data from db.json
function readDataFromFile() {
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(data);
}

// Write data to db.json
function writeDataToFile(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/notes', (req, res) => {
  const noteData = readDataFromFile();
  console.log('GET /api/notes - noteData:', noteData);
  res.json(noteData);
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uuid.v4(),
    };

    const noteData = readDataFromFile();
    noteData.push(newNote);
    writeDataToFile(noteData);

    const response = {
      status: 'success',
      body: newNote,
    };
    console.log('POST /api/notes - response:', response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting data');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const noteData = readDataFromFile();
  const updatedData = noteData.filter((note) => note.id !== noteId);
  writeDataToFile(updatedData);

  const response = {
    status: 'success',
    body: updatedData,
  };
  console.log('DELETE /api/notes/:id - response:', response);
  res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});