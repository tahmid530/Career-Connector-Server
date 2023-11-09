const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqx97wq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const jobsCollection = client.db('jobsDB').collection('jobs');
        const myJobsCollection = client.db('jobsDB').collection('my jobs');
      

        // Data read
        app.get('/my_jobs', async (req, res) => {
            const cursor = myJobsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Data read
        app.get('/jobs', async (req, res) => {
            const cursor = jobsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

         // Read Jobs data using id
         app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:  (id) }
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })

        // Data create
        app.post('/jobs', async (req, res) => {
            const newJobs = req.body;
            const result = await jobsCollection.insertOne(newJobs);
            res.send(result);
        })

        // My Jobs data read
        app.get('/my_jobs', async (req, res) => {
            const cursor = myJobsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // My Jobs data create
        app.post('/my_jobs', async (req, res) => {
            const newJobs = req.body;
            const result = await myJobsCollection.insertOne(newJobs);
            res.send(result);
        })

        // My Jobs data delete
        app.delete('/my_jobs/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId (id) }
            const result = await myJobsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

         // Read My Jobs data using id
         app.get('/my_jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId (id) }
            const result = await myJobsCollection.findOne(query);
            res.send(result);
        })

         // Update My Jobs data using id
         app.put('/my_jobs/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId (id) }
            console.log(filter);
            const options = { upsert: true };
            const updatedJobs = req.body;

            const myJobs = {
                $set: {
                    name: updatedJobs.name,
                    deadline: updatedJobs.deadline,
                    category: updatedJobs.category,
                    salary: updatedJobs.salary,
                    description: updatedJobs.description,
                    posting: updatedJobs.posting,
                    image: updatedJobs.image
                }
            }

            const result = await myJobsCollection.updateOne(filter, myJobs, options);
            console.log(result);
            res.send(result);
        })

          // Apply data read
          app.get('/apply', async (req, res) => {
            const cursor = applyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        const applyCollection = client.db('jobsDB').collection('apply');

        // Apply data create
        app.post('/apply', async (req, res) => {
            const newApply = req.body;
            console.log(newApply);
            const result = await applyCollection.insertOne(newApply);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('JOB SERVER IS RUNNING');
});

app.listen(port, () => {
    console.log(`Job Server is running on port: ${port}`);
});