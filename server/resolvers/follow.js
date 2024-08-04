const Follow = require('../models/follow.js');
const User = require('../models/user.js');
const { GraphQLError } = require('graphql');
const { redis } = require('../redis.js');

const resolvers = {
  Query: {
    findFollow: async () => {
      try {
        const result = await Follow.find();
        return result;
      } catch (err) {
        throw new GraphQLError('Failed to fetch follows');
      }
    },
    findFollowById: async (_, { followId }) => {
      try {
        const result = await Follow.findById(followId);
        if (!result) {
          throw new GraphQLError('Follow not found');
        }
        return result;
      } catch (err) {
        throw new GraphQLError('Follow not found');
      }
    },
    findFollowers: async (_, { userId }) => {
      try {
        const follows = await Follow.findByFollowingId(userId);
        return follows;
      } catch (err) {
        throw new GraphQLError('Failed to fetch followers');
      }
    },
    findFollowing: async (_, { userId }) => {
      try {
        const follows = await Follow.findByFollowerId(userId);
        return follows;
      } catch (err) {
        throw new GraphQLError('Failed to fetch following');
      }
    },
    findUser: async (_, { search }) => {
      return await User.findAll(search);
    },
    findUserById: async (_, { userId }) => {
      try {
        const data = await User.findById(userId);
        if (!data) {
          throw new GraphQLError('User not found');
        }
        return data;
      } catch (err) {
        throw new GraphQLError('User not found');
      }
    },
  },
  Mutation: {
    register: async (_, { name, username, email, password, image }) => {
      const result = await User.create({ name, username, email, password, image });

      if (result.acknowledged) {
        return {
          message: 'Success Adding User',
        };
      } else {
        throw new GraphQLError('Failed To Add User', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
    login: async (_, { email, password }) => {
      const result = await User.login({ email, password });
      await redis.del('post:all');
      return result;
    },
    addFollow: async (_, { inputFollow }, context) => {
      try {
        const user = await context.authentication();
        const followerId = user._id;
        const result = await Follow.create({ ...inputFollow, followerId });
        if (result.acknowledged) {
          return { message: 'Successfully added new follow' };
        }
        throw new GraphQLError('Failed to add follow');
      } catch (err) {
        throw new GraphQLError('Failed to add follow');
      }
    },
  },
  Follow: {
    followingUser: async (follow) => {
      try {
        const user = await User.findById(follow.followingId);
        return user;
      } catch (err) {
        throw new GraphQLError('Failed to fetch following user');
      }
    },
    followerUser: async (follow) => {
      try {
        const user = await User.findById(follow.followerId);
        return user;
      } catch (err) {
        throw new GraphQLError('Failed to fetch follower user');
      }
    },
  },
};

module.exports = resolvers;
