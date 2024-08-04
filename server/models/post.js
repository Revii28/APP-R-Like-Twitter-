const { DB } = require('../config/db.js');
const { ObjectId } = require('mongodb');
const { GraphQLError } = require('graphql');

class Post {
  static async findAll() {
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
        },
      },
      {
        $project: {
          'author.password': 0,
          'author._id': 0,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ];

    const postCollection = DB.collection('posts');
    const result = await postCollection.aggregate(pipeline).toArray();
    return result;
  }

  static async findById(postId) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(postId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
          },
        },
        {
          $project: {
            'author._id': 0,
            'author.password': 0,
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
      ];

      const postCollection = DB.collection('posts');
      const result = await postCollection.aggregate(pipeline).toArray();
      return result;
    } catch (error) {
      throw new GraphQLError('Failed to find post');
    }
  }

  static async create(inputPost) {
    try {
      const postCollection = DB.collection('posts');
      const result = await postCollection.insertOne({
        ...inputPost,
        authorId: new ObjectId(inputPost.authorId),
        comments: [],
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (result.acknowledged) {
        return { message: 'Successfully added new post' };
      }
    } catch (error) {
      throw new GraphQLError('Failed to create post');
    }
  }

  static async addComment(postId, content, username) {
    try {
      const newComment = {
        content,
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await DB.collection('posts').updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: {
            comments: newComment,
          },
        }
      );
      if (result.acknowledged) {
        return { message: 'Successfully added comment to post' };
      }
    } catch (error) {
      throw new GraphQLError('Failed to add comment');
    }
  }

  static async addLike(postId, username) {
    try {
      const addLike = {
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await DB.collection('posts').updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: { likes: addLike },
        }
      );
      if (result.acknowledged) {
        return { message: 'Successfully liked post' };
      }
    } catch (error) {
      throw new GraphQLError('Failed to add like');
    }
  }
}

module.exports = Post;
