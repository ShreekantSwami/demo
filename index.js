const PORT = 1402;

const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const { json, urlencoded } = require("express"); // Using Express built-in middleware

// const createConnection = require("./dbConnection");
const app = express();

const url =
  "mongodb+srv://shree20012018:853742691@login.nb3ko.mongodb.net/?retryWrites=true&w=majority&appName=login";

// Use built-in middleware for form data and JSON parsing
app.use(urlencoded({ extended: true })); // For handling URL-encoded form data
app.use(json()); // For handling JSON data

// Created a file path for the index.html file
const file = path.join(__dirname, "index.html");

// Middleware function for validating form data and creating a DB connection
const middleware = async (req, res, next) => {
  console.log("Middleware code started");
  console.log(req.body);

  const { username, email, mob } = req.body;
  console.log("Form Data:", username, email, mob);

  // Check if form data is valid (you can adjust this as needed)
  if (!username && !email && !mob) {
    console.log("Form integrity violated!");
    return res.status(401).send("Cannot authenticate"); // Send failure response if form is invalid
  } else {
    console.log("Form integrity not violated!");
    try {
      // Attempt to create a connection to MongoDB
      const client = new MongoClient(url);
      await client.connect();
      console.log("MongoDB Connection established.");
      const db = client.db("Shree");
      const collection = db.collection("Users");
      console.log("Database and collection created successfully.");
      createUser(collection, req.body);
      return res.status(200).send("Form Checked Successfully"); // Send response after successful check
    } catch (err) {
      // Catch any errors during the DB connection
      console.error("Error connecting to DB:", err.message);
      return res
        .status(500)
        .send("Database connection failed. Please try again later.");
    }
  }
};

const createUser = async (collection, obj) => {
  const object = { username: obj.username, email: obj.email, mob: obj.mob };
  const result = await collection.insertOne(object);
  console.log(result);
};

// Base route to serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(file); // Send the HTML form
});

// Register route to handle form submission
app.post("/register", middleware, (req, res) => {
  const { username, email, mob } = req.body;
  console.log("User Registration:", username, email, mob);
});

// Starting the server on the specified port
app.listen(PORT, () => {
  console.log(`The server is listening on Port ${PORT}`);
});
