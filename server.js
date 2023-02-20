const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./public/assets/js/uid');
const { application } = require('express');

const app = express();
const PORT = 3001;

app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res)=> {

 // Log that a POST request was received
 console.info(`${req.method} request received to add a review`);

 // Destructuring assignment for the items in req.body
 const { text, title } = req.body;

 // If all the required properties are present
 if (text && title) {
   // Variable for the object we will save
   const newNote = {
     text,
     title,
     _id: uuid(),
   };

   // Obtain existing reviews
   fs.readFile('./db/db.json', 'utf8', (err, data) => {
     if (err) {
       console.error(err);
     } else {
       // Convert string into JSON object
       const parsedNotes = JSON.parse(data);

       // Add a new Note
       parsedNotes.push(newNote)

       // Write updated notes back to the file
       fs.writeFile(
         './db/db.json',
         JSON.stringify(parsedNotes, null, 4),
         (writeErr) =>
           writeErr
             ? console.error(writeErr)
             : console.info('Successfully updated notes!')
       );
     }
   });

   const response = {
     status: 'success',
     body: newNote,
   };

   console.log(response);
   res.status(201).json(response);
 } else {
   res.status(500).json('Error in posting note');
 }


});



app.delete('/api/notes/:id', (req, res) => {

console.info('note deleted');

});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
