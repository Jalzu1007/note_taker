// apiRoutes.js
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const router = express.Router();

router.get('/notes', (req, res) => {
  const notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
  const notes = JSON.parse(notesData);
  res.json(notes);
});

router.post('/notes', (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    id: uuidv4(),
    title,
    text,
  };

  const notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
  const notes = JSON.parse(notesData);

  notes.push(newNote);

  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes));

  res.json(newNote);
});

router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  const notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
  let notes = JSON.parse(notesData);

  notes = notes.filter((note) => note.id !== noteId);

  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes));

  res.json({ message: 'Note deleted successfully' });
});

module.exports = router;