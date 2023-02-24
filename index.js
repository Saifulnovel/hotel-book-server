const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 8000

// middlewares
app.use(cors())

app.use(express.json())
app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render("error");
});
// Database Connection
const uri = process.env.DB_URI

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const homesCollection = client.db('hotelbook').collection('homes')
    const userCollection = client.db('hotelbook').collection('users')

    // save user email

    app.put('/user/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body 
      const filter = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: user,
      }
      const result = await userCollection.updateOne(filter,  updateDoc, options)
      console.log(result)

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:'1d'
      })
      console.log(token);
      // res.status(400)
      res.send({ result, token });
    })



    console.log('Database Connected...')
  } finally {
  }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Server is running...no is')
})

app.listen(port, () => {
  console.log(`Server is running...on ${port}`)
})
