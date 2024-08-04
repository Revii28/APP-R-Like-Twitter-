const typeDefs = `#graphql
  type Post {
    _id: String
    content: String!
    tags: [String]
    imgUrl: String
    authorId: String!
    author: Author
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  input NewPost {
    content: String!
    tags: [String]
    imgUrl: String
  }

  type Author {
    name: String
    email: String
    password: String
    image: String
  }

  input AuthorInput {
    name: String!
    email: String!
    password: String!
  }

  type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String!
    createdAt: String
    updatedAt: String
  }

  type CommetSuccess {
    message: String
  }

  type LikeSuccess {
    message: String
  }

  type PostSuccess {
    message: String
  }

  type Query {
    findPost: [Post]
    findPostById(postId: String!): Post
  }

  type Mutation {
    addPost(inputPost: NewPost): PostSuccess
    addComment(postId: String!, content: String!): CommetSuccess
    addLike(postId: String!): LikeSuccess
  }
`;

module.exports = typeDefs;
