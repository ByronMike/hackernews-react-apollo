// This is a JavaScript code that defines and starts an Apollo Server, a GraphQL server implementation provided by Apollo.
// It is the entry point for our GraphQL server.
const { ApolloServer, PubSub } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Vote = require('./resolvers/Vote');
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');

const pubsub = new PubSub();

const prisma = new PrismaClient({
  errorFormat: 'minimal'
});

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote
};

// typeDefs defines the GraphQL schema using the schema.graphql file read with fs.readFileSync
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  // The resolvers object contains the resolvers for the different types defined in the schema
  resolvers, 
  // The context function is responsible for creating the context object, which is a collection of data that is shared among all resolvers in a GraphQL server.
  // This context function takes an object destructured from the req argument passed to it. The req argument is an HTTP request object that is automatically provided by Apollo Server for each incoming request.
  // BONUS : The context object returned by this function will be passed to each resolver function in the GraphQL schema, and the resolver functions can use the context object to retrieve and manipulate data. The prisma and pubsub objects in the context object are commonly used to access and manipulate data in a database and publish and subscribe to real-time events, respectively. The userId property in the context object can be used to authenticate and authorize users.
  context: ({ req }) => { 
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          // The getUserId function, imported from ./utils, is called to retrieve a user ID from the Authorization header of the HTTP request, if present
          ? getUserId(req)
          : null
    };
  },
  // This is a configuration object that defines the behavior of the subscriptions feature in an Apollo Server instance. Specifically, it defines a callback function that is called when a client connects to the server using a WebSocket connection for subscriptions.
  subscriptions: {
    // The onConnect function takes a single argument, connectionParams, which is an object containing parameters passed by the client during the connection. In this case, it is used to check if the client has provided an authorization token (connectionParams.authToken) in the connection parameters.
    onConnect: (connectionParams) => {
      if (connectionParams.authToken) {
        return {
          prisma,
          userId: getUserId(
            null,
            connectionParams.authToken
          )
        };
      } else {
        return {
          prisma
        };
      }
    }
  }
});

// This code creates an instance of the ApolloServer and starts listening for incoming requests by calling the listen() method on the server instance.
server
	// Once the server is started and listening for incoming requests, the listen() method returns a Promise that resolves to an object with the url property that contains the URL at which the server is listening.
  .listen()
	// The then() method is then called on this Promise to handle the resolution of the Promise. The then() method takes a callback function as an argument, which in this case is an arrow function that logs a message indicating that the server is running and at which URL it is running.
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );