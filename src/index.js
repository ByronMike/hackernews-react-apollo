import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
// 8) Import the Apollo dependencies  for the token
import { setContext } from '@apollo/client/link/context';
// 10) Import the key we need to retrieve the token from localStorage
import { AUTH_TOKEN } from './constants';

// 1 We import all the dependencies we need to wire up the Apollo client, all from @apollo/client.
import {
  ApolloProvider, // A provider to wrap around the React app called
  ApolloClient, // In contrast to working with REST APIs, we can simply write queries and mutations and send them using an ApolloClient instance
  createHttpLink, // It connect our ApolloClient instance with the GraphQL API.
  InMemoryCache,
} from "@apollo/client";
// 5) We now need to wrap the App with BrowserRouter so that all child components of App will get access to the routing functionality.
import { BrowserRouter } from 'react-router-dom';

// 2 We create the httpLink that will connect our ApolloClient instance with the GraphQL API. The GraphQL server will be running on http://localhost:4000.
const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

// 7) Apollo provides a nice way for authenticating (transmettre le token) all requests by using the concept of middleware, implemented as an Apollo Link.
// This middleware will be invoked every time ApolloClient sends a request to the server. Apollo Links allow us to create middlewares that modify requests before they are sent to the server.
// Explanation :  first, we get the authentication token from localStorage if it exists; after that, we return the headers to the context so httpLink can read them.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

// 3 We instantiate ApolloClient by passing in the httpLink and a new instance of an InMemoryCache.
const client = new ApolloClient({
  //link: httpLink,
  // 9) ApolloClient gets instantiated with the correct link -
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// 4 Finally, we render the root component of our React app. The App is wrapped with the higher-order component ApolloProvider that gets passed the client as a prop.
// 6 Wrap the app with BrowserRouter
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);