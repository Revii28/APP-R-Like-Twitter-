const User = require('../models/user.js');
const { GraphQLError } = require('graphql');
const { redis } = require('../redis.js');

const resolvers = {
  Query: {
    findUser: async (_, { search }) => {
      const data = await User.findAll(search);
      return data;
    },

    findUserById: async (_, { userId }) => {
      try {
        const data = await User.findById(userId);
        if (!data) {
          throw new GraphQLError("User not found");
        }
        return data;
      } catch (err) {
        throw new GraphQLError("User not found");
      }
    },
  },

  Mutation: {
    register: async (_, { name, username, email, password, image }) => {
      const result = await User.create({ name, username, email, password, image });

      if (result.acknowledged) {
        return {
          message: "Success Adding User",
        };
      } else {
        throw new GraphQLError("Failed To Add User", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    },

    login: async (_, { email, password }) => {
      const result = await User.login({ email, password });
      await redis.del("post:all");
      return result;
    },
  },
};

module.exports = resolvers;
