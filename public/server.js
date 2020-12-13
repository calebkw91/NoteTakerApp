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

let writeNotes = (notes) =>
{
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
    });
}

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
    readFileContent(path.join(__dirname, '../db/db.JSON'))
        .then(data =>
        {
            res.send(JSON.parse(data));
        });
});

app.post("/api/notes", function(req, res) 
{
    return res.json(customers);
});

app.delete("/api/notes", function(req, res) 
{
    return res.json(customers);
});

// Displays a single character, or returns false
app.get("/api/waitlist", function(req, res) 
{
    return res.json(waitlist);
});

app.post("/api/clear", function(req, res) 
{
    customers = [];
    waitlist = [];
});

// Create New Characters - takes in JSON input
app.post("/api/tables", function(req, res) 
{
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware

    let newReservation = req.body;
    let fullHouse = true;

    // Using a RegEx Pattern to remove spaces from newCharacter
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html

    console.log(newReservation);

    if(customers.length < 5)
    {
        customers.push(newReservation);
        fullHouse = true;
    }
    else
    {
        waitlist.push(newReservation);
        fullHouse = false;
    }

    res.send(fullHouse);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  