const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(MONGODB_URI);

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectToMongoDB();

// Routes
app.post('/api/users', async (req, res) => {
  try {
    const database = client.db("hostel_management");
    const users = database.collection("users");
    
    const userData = req.body;
    const existingUser = await users.findOne({ registrationNumber: userData.registrationNumber });
    
    if (existingUser) {
      await users.updateOne(
        { registrationNumber: userData.registrationNumber },
        { $set: userData }
      );
    } else {
      await users.insertOne(userData);
    }
    
    res.json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save user data" });
  }
});

app.get('/api/users/:registrationNumber', async (req, res) => {
  try {
    const database = client.db("hostel_management");
    const users = database.collection("users");
    const user = await users.findOne({ registrationNumber: req.params.registrationNumber });
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 