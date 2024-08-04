const { MongoClient } = require('mongodb');


const uri = "mongodb+srv://revirifaldi:26KWZf7AaTYjOFFw@rmt-050-revi.t2qt3qp.mongodb.net/?retryWrites=true&w=majority&appName=RMT-050-Revi";

const client = new MongoClient(uri);

async function run() {
  try {

    const database = client.db("R");
    const users = database.collection("users");


    const query = { title: "The Room" };

    const options = {
    
      sort: { "imdb.rating": -1 },
   
      projection: { _id: 0, title: 1, imdb: 1 },
    };


    const movie = await users.findOne(query, options);

    console.log(movie);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
