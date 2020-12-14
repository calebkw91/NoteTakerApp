// Dependencies
// =============================================================
let express = require("express");
let path = require("path");
let fs = require("fs");
let util = require("util");

const readFileContent = util.promisify(fs.readFile);

// Sets up the Express App
// =============================================================
let app = express();
let PORT = process.env.PORT || 3001;

// Sets up the Express app to handle fullHouse parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')))

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

// Displays all characters
app.get("/api/notes", function(req, res) 
{
    res.send(JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.JSON'))));
});

app.post("/api/notes", function(req, res) 
{

    let notes = [];
    let newNote = req.body;

    notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.JSON')));

    newNote.id = notes.length;

    notes.push(newNote);
    notes = JSON.stringify(notes);

    fs.writeFile(path.join(__dirname, '../db/db.JSON'), notes, (err) =>
    {
        if(err)
        {
            return console.log(err);
        }
        else
        {
            console.log("File Saved!");
        }

        res.end();
    });
});

app.delete("/api/notes/:id", function(req, res) 
{
    deleteID = req.params.id;

    let savedNotes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.JSON')));
    let notes = savedNotes.filter(note =>
        {
            return note.id != deleteID;
        })

    notes = JSON.stringify(notes);

    fs.writeFile(path.join(__dirname, '../db/db.JSON'), notes, (err) =>
    {
        if(err)
        {
            return console.log(err);
        }
        else
        {
            console.log("File Saved!");
        }

        res.end();
    });
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  