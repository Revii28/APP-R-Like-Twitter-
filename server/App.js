const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const userTypeDefs = require('./schema/user.js');
const postTypeDefs = require('./schema/posts.js');
const followTypeDefs = require('./schema/follow.js');

const userResolver = require('./resolvers/user.js');
const postResolver = require('./resolvers/posts.js');
const followResolver = require('./resolvers/follow.js');

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolver, postResolver, followResolver],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req, res }) => {
    return {
      authentication: () => {
        const authorization = req.headers.authorization;

        if (!authorization) {
          throw new GraphQLError("Unauthenticated user");
        }
        const token = authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.PASSWORD_JWT);
        return user;
      },
    };
  },
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
