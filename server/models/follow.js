const { DB } = require('../config/db.js');
const { ObjectId } = require('mongodb');

class Follow {
  static async find() {
    const followCollection = DB.collection('follows');
    return await followCollection.find().toArray();
  }

  static async findById(followId) {
    const followCollection = DB.collection('follows');
    return await followCollection.findOne({ _id: new ObjectId(followId) });
  }

  static async findByFollowerId(followerId) {
    const followCollection = DB.collection('follows');
    const pipeline = [
      {
        $match: {
          followerId: new ObjectId(followerId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'followingId',
          foreignField: '_id',
          as: 'followingUser',
        },
      },
      {
        $unwind: {
          path: '$followingUser',
        },
      },
      {
        $project: {
          'followingUser.password': 0,
          'followingUser._id': 0,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ];
    return await followCollection.aggregate(pipeline).toArray();
  }

  static async findByFollowingId(followingId) {
    const followCollection = DB.collection('follows');
    const pipeline = [
      {
        $match: {
          followingId: new ObjectId(followingId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'followerId',
          foreignField: '_id',
          as: 'followerUser',
        },
      },
      {
        $unwind: {
          path: '$followerUser',
        },
      },
      {
        $project: {
          'followerUser.password': 0,
          'followerUser._id': 0,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ];
    return await followCollection.aggregate(pipeline).toArray();
  }

  static async create(inputFollow) {
    const followCollection = DB.collection('follows');
    const result = await followCollection.insertOne({
      ...inputFollow,
      followerId: new ObjectId(inputFollow.followerId),
      followingId: new ObjectId(inputFollow.followingId),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return result;
  }
}

module.exports = Follow;
