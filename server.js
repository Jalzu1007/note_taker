// Im port module dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const app = express();

// Set the port for the server
const PORT = process.env.PORT || 3001;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Parse JSON data in the request body
app.use(express.json());
//Parse URL-encoded data in the request body
app.use(express.urlencoded({ extended: true }));
// Path to the JSON database file
const dbFilePath = path.join(__dirname, 'db', 'db.json');

// Function to read data from the database file
function readDataFromFile() {
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(data);
}

// Function to write data to the database file
function writeDataToFile(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

// Route handler for the '/notes' GET request
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route handler for the root '/' GET request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route handler for the '/api/notes' GET request
app.get('/api/notes', (req, res) => {
  const noteData = readDataFromFile();
  console.log('GET /api/notes - noteData:', noteData);
  res.json(noteData);
});

// Route handler for the '/api/notes' POST request
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

// Route handler for the '/api/notes/:id' DELETE request
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

// Open PORT server 
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});