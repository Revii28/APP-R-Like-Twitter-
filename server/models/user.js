const { DB } = require('../config/db.js');
const { z } = require('zod');
const bcryptjs = require('bcryptjs');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

dotenv.config();

const UserValidate = z.object({
  name: z.string().min(1).max(255),
  username: z.string().min(5, { message: 'Username must be 5 or more characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(5, { message: 'Password must be 5 or more characters long' }),
  image: z.string().min(1).max(255),
});

class User {
  static async findAll(search) {
    const userCollection = DB.collection('users');
    return userCollection
      .find({ username: { $regex: search, $options: 'i' } })
      .toArray();
  }

  static async findById(userId) {
    const userCollection = DB.collection('users');
    return userCollection.findOne({
      _id: new ObjectId(userId),
    });
  }

  static async create({ name, username, email, password, image }) {
    const userCollection = DB.collection('users');
    const existingUser = await userCollection.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already exists.');
      }
      if (existingUser.username === username) {
        throw new Error('Username already exists.');
      }
    }
    const validatedData = UserValidate.parse({
      name,
      username,
      email,
      password: bcryptjs.hashSync(password, 10),
      image,
    });

    return await userCollection.insertOne(validatedData);
  }

  static async login({ email, password }) {
    const userCollection = DB.collection('users');
    const user = await userCollection.findOne({
      email: email,
    });

    if (!user) {
      throw new GraphQLError('Invalid email/password', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new GraphQLError('Invalid email/password', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
        image: user.image,
      },
      process.env.PASSWORD_JWT
    );
    return {
      accessToken,
    };
  }
}

module.exports = User;
