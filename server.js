// Using Express as a backend

const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs")
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();
const port = 3000;

// Setup MongoDB Client
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run() {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });

      console.log("pinged Database, connected!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
      console.log("goddammit the mongo database is fucked")
    }
}
run().catch(console.dir);

// const database = client.db("prod");
const database = client.db("dev");
const users = database.collection("users");
const projects = database.collection("projects");

app.get("/", (req, res) => {
    res.json({
        uptime: process.uptime(),
        version: process.env.VERSION
    });
});

app.get("/health", (req, res) => {
    res.sendStatus(200);
});

// Users
app.get("/users/byID/:id", (req, res) => {
    const usrid = req.params.id;
    const user = users.findOne({id: usrid});
    if (user) { res.json(user); } else { res.sendStatus(404); }
});

app.get("/users/byName/:name", (req, res) => {
    const name = req.params.name;
    const user = users.findOne({username: name});
    if (user) { res.json(user); } else { res.sendStatus(404); }
});

app.post("/users", (req, res) => {
    const user = req.body;
    if (!user) { res.sendStatus(400); }
    users.insertOne(user);
    res.sendStatus(201);
});

app.get("/projects/:id", (req, res) => {
    const id = req.params.id;
    const project = projects.find(project => project.id === id);
    if (project) {
        res.json(project);
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});