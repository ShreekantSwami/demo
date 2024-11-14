const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017/";

const client = new MongoClient(url);

const createConnection = async () => {
  try {
    await client.connect();
    console.log("Connection established");
    // return client;
  } catch (err) {
    console.log("Error connecting: " + err.message);
    throw err;
  }
};

const getUsersCollection = () => {
  const db = client.db("LoggingUsers");
  return db.collection("Users");
};

const createUser = async (userData) => {
  const collection = getUsersCollection();
  try {
    const result = await collection.insertOne(userData);
    console.log(`New user created with ID: ${result.insertedId}`);
    return result;
  } catch (err) {
    console.error("Error creating user: " + err.message);
    throw err;
  }
};

module.exports = { createConnection };
