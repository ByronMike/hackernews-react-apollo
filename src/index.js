import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";

// 1 We import all the dependencies we need to wire up the Apollo client, all from @apollo/client.
import {
  ApolloProvider, // A provider to wrap around the React app called
  ApolloClient, // In contrast to working with REST APIs, we can simply write queries and mutations and send them using an ApolloClient instance
  createHttpLink, // It connect our ApolloClient instance with the GraphQL API.
  InMemoryCache,
} from "@apollo/client";

// 2 We create the httpLink that will connect our ApolloClient instance with the GraphQL API. The GraphQL server will be running on http://localhost:4000.
const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

// 3 We instantiate ApolloClient by passing in the httpLink and a new instance of an InMemoryCache.
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// 4 Finally, we render the root component of our React app. The App is wrapped with the higher-order component ApolloProvider that gets passed the client as a prop.
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
