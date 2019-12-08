const fs = require("fs"); // required to read the GraphQL schema file
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

// ================
// GraphQL
// ================
let aboutMessage = "Issue Tracker API v1.0";

const issuesDB = [
  {
    id: 1,
    status: "New",
    owner: "Ravan",
    effort: 5,
    created: new Date("2019-01-15"),
    due: undefined,
    title: "Error in console when clicking Add"
  },
  {
    id: 2,
    status: "Assigned",
    owner: "Eddie",
    effort: 14,
    created: new Date("2019-01-16"),
    due: new Date("2019-01-01"),
    title: "Missing bottom border on panel"
  }
];

// construct custom Date scalar type resolver
const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "A Date() type in GraphQl as a scalar",
  serialize(value) {
    return value.toISOString(); // convert a Date to a String in ISO 8601 format
  },
  // parsers for receiving date values:
  // parseLiteral is used in the normal case where the field is specified in-place in the query
  parseLiteral(ast) {
    // ast.kind indicates the type of property the parser found (float, integer or string)
    // undefined indicates the type could not be converted, and treated as an error
    return ast.kind == Kind.STRING ? new Date(ast.value) : undefined;
  },
  // parseValue is called if the input type is a variable (JS object)
  parseValue(value) {
    return new Date(value);
  }
});

// handlers / resolvers
// follows the same structure of the schema
const resolvers = {
  Query: {
    about: () => aboutMessage, // function that returns the aboutMessage varaible
    issueList: () => issuesDB // return the issueDB
  },
  Mutation: {
    // setAboutMessage function assigned as the resolver
    // using ES2015 property assignment shorthand syntax
    // { setAboutMessage: setAboutMessage }
    setAboutMessage,
    // issueAdd function assigned as resolver
    issueAdd
  },
  GraphQLDate
};

// resolver functions take 4 arguments: obj, args, context & info.
// only two args as specified here
// ES2105 destructuring assignment was used to access the message property
// in the second argumant (args.message)
function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

// resolver takes an IssueInput type as argument and creates a new issue in the DB
function issueAdd(_, { issue }) {
  issue.created = new Date();
  issue.id = issuesDB.length + 1;
  // set the default status
  if (issue.status == undefined) issue.status = "New";
  // append the issue to the global variable issueDB
  issuesDB.push(issue);
  // return the issue object
  return issue;
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
