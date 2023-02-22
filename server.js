const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const fs = require('fs');
// Helper method for generating unique ids
//const uuid = require('./public/assets/js/uid');
const { v4: uuidv4 } = require('uuid');
const { application } = require('express');

const app = express();
const port = process.env.PORT || 3001

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
          res.json(parsedNotes)

        }
    });
});

app.post('/api/notes', (req, res) => {

 // Log that a POST request was received
 console.info(`${req.method} request received to add a review`);

 // Destructuring assignment for the items in req.body
 const { title, text } = req.body;
 
 
 // If all the required properties are present
 if (text && title) {
   // Variable for the object we will save
   const newNote = {
     text,
     title,
     id: uuidv4(),
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

   
   res.status(201).json(response);
 } else {
   res.status(500).json('Error in posting note');
 }

});



// app.delete('/api/notes/:id', (req, res) => {
 
//  // Log that a DELETE request was received
//  console.info(`${req.method} request received to delete a note`);


//  // Obtain existing notes
//  fs.readFile('./db/db.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       // Convert string into JSON object
//       const parsedNotes = JSON.parse(data);
   
//       if (req.params.id) {
//         const id = req.params.id;
//       for (let i=0; i < parsedNotes.length; i++) {
//        let note = parsedNotes[i];
//        if (note._id === id) {
//        const newNotes = parsedNotes.splice(i, 1);
         
//        // Write updated notes back to the file
//        fs.writeFile(
//         './db/db.json',
//         JSON.stringify(newNotes, null, 4),
//         (writeErr) =>
//           writeErr
//             ? console.error(writeErr)
//             : console.info('Successfully updated notes!')
//       );

//       const response = {
//         status: 'success',
//         body: newNotes,
//       };

//       res.status(201).json(response);
//       console.info('note deleted');
//        } else {
//         res.status(500).json('Error in deleting note. ID for note was not found.');
//        }
//     }
//    }
   
//     }



// });



app.delete('/api/notes/:id', (req, res) => {

    // Log that a DELETE request was received
    console.info(`${req.method} request received to delete a note`);
  
    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json('Error in deleting note. Failed to read notes file.');
        return;
      }
  
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
        console.log(req.params.id);
      //if (!req.params.id) {
       // res.status(500).json('Error in deleting note. ID for note was not provided.');
       // return;
     // }
  
     if (req.params.id) {
      const id = req.params.id;
      console.log(id);
      let found = false;
      
  
      for (let i=0; i < parsedNotes.length; i++) {
        let note = parsedNotes[i];
        if (note.id === id) {
          parsedNotes.splice(i, 1);
          found = true;
          break;
        }
      }
  
      if (found) {
        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
  
   
        console.info('note deleted');
        return res.status(200).json(parsedNotes);
      } else {
        res.status(500).json('Error in deleting note. ID for note was not found.');
      }
     }
    });
  
  });
  

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
  );
