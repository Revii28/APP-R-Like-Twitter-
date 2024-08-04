const typeDefs = `#graphql
  type Follow {
    _id: String
    followingId: String
    followerId: String
    createdAt: String
    updatedAt: String
    followingUser: User
    followerUser: User
  }

  input FollowInput {
    followingId: String!
  }

  type FollowResponse {
    message: String
  }

  type Query {
    findFollow: [Follow]
    findFollowById(followId: String!): Follow
    findFollowers(userId: String!): [Follow]
    findFollowing(userId: String!): [Follow]
  }

  type Mutation {
    addFollow(inputFollow: FollowInput!): FollowResponse
  }
`;

module.exports = typeDefs;
