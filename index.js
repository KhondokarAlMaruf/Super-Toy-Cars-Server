const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8fpfgcv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const usersCollection = client.db("super-toy-cars").collection("users");
  const toysCollection = client.db("super-toy-cars").collection("toys");
  const categoryListCollection = client
    .db("super-toy-cars")
    .collection("categoryList");

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    //save users info in db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.get("/category", async (req, res) => {
      const query = {};
      const result = await categoryListCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/toys", async (req, res) => {
      const query = {};
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    //post  cars in db
    app.post("/toys", async (req, res) => {
      const toys = req.body;
      const result = await toysCollection.insertOne(toys);
      res.send(result);
    });

    // get my cars
    app.get("/my-toys", async (req, res) => {
      const email = req.query.email;
      const query = {
        seller_email: email,
      };
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });

    // delete product
    app.delete("/deleteproduct/:id", async (req, res) => {
      const deleteId = req.params.id;
      const query = {
        _id: new ObjectId(deleteId),
      };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("super toy cars server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
