const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const router = express.Router();

router.get('/notes', (req, res) => {
  const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8'));
  res.json(notesData);
});

router.post('/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8'));
  notesData.push(newNote);
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notesData));

  res.json(newNote);
});

router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8'));
  const updatedNotes = notesData.filter((note) => note.id !== noteId);
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(updatedNotes));

  res.json({ message: 'Note deleted successfully' });
});

module.exports = router;
