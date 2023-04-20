// 0) Import des libraires => useQuery & gql
import React from "react";
import Link from "./Link";
// useQuery hook is used for  fetching, caching, and error handling of data.
/* gql is a function provided by the @apollo/client library for creating GraphQL queries, mutations, and subscriptions as plain JavaScript strings. 
This function allows you to define your GraphQL operation as a string literal within a template literal.
*/

/* The useQuery Hook returns three items that are relevant for our purposes at this point:

1) loading: Is true as long as the request is still ongoing and the response hasn’t been received.
2) error: In case the request fails, this field will contain information about what exactly went wrong.
3) data: This is the actual data that was received from the server. It has the links property which represents a list of Link elements.*/

import { useQuery, gql } from "@apollo/client";

// 1) Query with Apollo/client and gql
// 5) Add postedBy and votes  (+ export for futures importing in other files)
export const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

// 2) Overall, this code renders a list of Link components with the data obtained from a GraphQL query using the useQuery hook.
const LinkList = () => {
  // The useQuery hook from the @apollo/client library is used to execute a GraphQL query called FEED_QUERY. The data variable returned from useQuery contains the response data from executing the query.
  const { data } = useQuery(FEED_QUERY);

  return (
    <div>
      {data && (
        <> 
          {/* 4) Pass down an index from the LinkList component to render each Link element and its position inside the list, */}
          {data.feed.links.map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;
