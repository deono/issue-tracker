const fs = require("fs"); // required to read the GraphQL schema file
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

// ================
// GraphQL
// ================
let aboutMessage = "Issue Tracker API v1.0";

// handlers / resolvers
// follows the same structure of the schema
const resolvers = {
  Query: {
    // function that returns the aboutMessage varaible
    about: () => aboutMessage
  },
  Mutation: {
    // setAboutMessage function assigned as the resolver
    // using ES2015 property assignment shorthand syntax
    // { setAboutMessage: setAboutMessage }
    setAboutMessage
  }
};

// resolver functions take 4 arguments: obj, args, context & info.
// only two args as specified here
// ES2105 destructuring assignment was used to access the message property
// in the second argumant (args.message)
function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

// initialize the GraphQL server, which is an AppoloServer object
// The constructor takes the schema and resolvers as properties, and
// returns a GraphQL server object
const server = new ApolloServer({
  // read the typeDefs from the GraphQL schema file
  typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"),
  resolvers
});

const app = express();

// Express.js static pages middleware
app.use(express.static("public"));

// install the ApolloServer as middleware in Express
server.applyMiddleware({ app, path: "/graphql" });

// start the express server
app.listen(3000, function() {
  console.log("App has started on port 3000");
});
