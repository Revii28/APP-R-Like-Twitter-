const typeDefs = `#graphql
  type User {
    _id: String
    name: String
    username: String
    email: String
    password: String
    image: String
  }

  type RegisterResponse {
    message: String
  }

  type Query {
    findUser: [User]
  }

  type LoginResponse {
    accessToken: String!
  }

  type Query {
    findUser(search: String!): [User]
    findUserById(userId: String!): User
  }

  type Mutation {
    register(name: String!, username: String!, email: String!, password: String!, image: String!): RegisterResponse
    login(email: String!, password: String!): LoginResponse
  }
`;

module.exports = typeDefs;


