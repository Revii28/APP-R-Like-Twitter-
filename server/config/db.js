const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.URI_MONGODB;

const client = new MongoClient(uri);

const DB_NAME = 'R';

const DB = client.db(DB_NAME);

module.exports = { client, DB };
