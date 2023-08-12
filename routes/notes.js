const notes = require('express').Router();
const shortid = require('shortid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for saving notes
notes.post('/', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    const numShortId = shortid.generate();

    // Variable for the object we will save
    const newNote = {
        id: numShortId,
        title,
        text,
    };

    readAndAppend(newNote, './db/db.json');

    res.json(newNote);
  } else {
    res.error('Error in posting feedback');
  }
});

// DELETE Route for deleting notes
notes.delete('/:id', (req, res) => {
    if (req.params.id) {
        readFromFile('./db/db.json', 'utf-8')
        .then(json => {
            const data = JSON.parse(json);
            const noteId = req.params.id;
            const noteToDelete = data.findIndex(note => note.id === noteId);
            if (noteToDelete !== -1) {
                data.splice(noteToDelete, 1);
                writeToFile('./db/db.json', data);
                res.json(`Note ${noteId} has been deleted!`);
            }
            else {
                res.status(404).send(`Note ${noteId} does not exist!`);
            }
        })
        .catch(error => {
            console.error(`${error}`);
            res.status(500).send('An error occurred while deleting the note.');
        });       
    }
});

module.exports = notes;
