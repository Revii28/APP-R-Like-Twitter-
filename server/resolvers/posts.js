const Post = require('../models/post.js');
const { GraphQLError } = require('graphql');
const { redis } = require('../redis.js');

const resolvers = {
  Query: {
    findPost: async (_, __, context) => {
      try {
        await context.authentication();
        const userCache = await redis.get('post:all');
        if (userCache) {
          return JSON.parse(userCache);
        } else {
          const result = await Post.findAll();
          await redis.set('post:all', JSON.stringify(result));
          return result[0];
        }
      } catch (err) {
        console.log(err);
        throw new GraphQLError('Failed to fetch posts');
      }
    },

    findPostById: async (_, { postId }, context) => {
      await context.authentication();
      const data = await Post.findById(postId);
      return data[0];
    },
  },

  Mutation: {
    addPost: async (_, { inputPost }, context) => {
      try {
        const user = await context.authentication();
        const authorId = user._id;
        const newPost = await Post.create({ ...inputPost, authorId });
        await redis.del('post:all');
        return newPost;
      } catch (err) {
        console.log(err);
        throw new GraphQLError('Failed to add post');
      }
    },

    addComment: async (_, { postId, content }, context) => {
      try {
        const user = await context.authentication();
        const username = user.username;
        const addComment = await Post.addComment(postId, content, username);
        await redis.del('post:all');
        return addComment;
      } catch (err) {
        console.log(err);
        throw new GraphQLError('Failed to add comment');
      }
    },

    addLike: async (_, { postId }, context) => {
      try {
        const user = await context.authentication();
        const username = user.username;
        const addLike = await Post.addLike(postId, username);
        await redis.del('post:all');
        return addLike;
      } catch (err) {
        console.log(err);
        throw new GraphQLError('Failed to add like');
      }
    },
  },
};

module.exports = resolvers;
