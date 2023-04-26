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
// 12) Import useLocation : useLocation hook to get the current pathname of the page being visited.
import { useLocation } from 'react-router-dom';
// 15) Import LINKS_PER_PAGE
import { LINKS_PER_PAGE } from '../constants';

// 1) Query with Apollo/client and gql
// 5) Add postedBy and votes  (+ export for futures importing in other files)
// export const FEED_QUERY = gql`
//   {
//     feed {
//       id
//       links {
//         id
//         createdAt
//         url
//         description
//         postedBy {
//           id
//           name
//         }
//         votes {
//           id
//           user {
//             id
//           }
//         }
//       }
//     }
//   }
// `;

// 11) Add three arguments to the FeedQuery by replacing the FEED_QUERY definition 
// The query now accepts arguments that we’ll use to implement pagination and ordering. skip defines the offset where the query will start. For example, if we passed a value of 10 for this argument, it means that the first 10 items of the list will not be included in the response. take then defines the limit or how many elements we want to load from that list. If we pass in 10 for skip and 5 for take, we’ll receive items 10 to 15 from the list. orderBy defines how the returned list should be sorted.
export const FEED_QUERY = gql`
  query FeedQuery(
    $take: Int
    $skip: Int
    $orderBy: LinkOrderByInput
  ) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
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
      count
    }
  }
`;

// 8) The NEW_LINKS_SUBSCRIPTION will use the subscription operation of the GraphQL server to listen for any newly created links.
const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
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
`;

// 10) gql implementation for new_votes_subscription
const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
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
      user {
        id
      }
    }
  }
`;

// 14) The getQueryVariables function is responsible for returning values for skip, take, and orderBy. For skip, we first check whether we are currently on the /new route. If so, the value for skip is the current page (subtracting 1 to handle the index) multiplied by the LINKS_PER_PAGE contstant. If we’re not on the /new route, the value for skip is 0. We use the same LINKS_PER_PAGE constant to determine how many links to take.

// We’re now passing take, skip, orderBy values as variables based on the current page.

// Also note that we’re including the ordering attribute { createdAt: 'desc' } for the new page to make sure the newest links are displayed first. The ordering for the /top route will be calculated manually based on the number of votes for each link.

// We also need to define the LINKS_PER_PAGE constant and then import it into the LinkList component.
const getQueryVariables = (isNewPage, page) => {
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const take = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = { createdAt: 'desc' };
  return { take, skip, orderBy };
};

// 2) Overall, this code renders a list of Link components with the data obtained from a GraphQL query using the useQuery hook.
const LinkList = () => {

  // 12) We use the useLocation hook to get the current pathname of the page being visited.
  const location = useLocation();
  const isNewPage = location.pathname.includes(
    'new'
  );
  const pageIndexParams = location.pathname.split(
    '/'
  );
  const page = parseInt(
    pageIndexParams[pageIndexParams.length - 1]
  );
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  // The useQuery hook from the @apollo/client library is used to execute a GraphQL query called FEED_QUERY. The data variable returned from useQuery contains the response data from executing the query.
  // const { data } = useQuery(FEED_QUERY);
  // 6) For the app to update in realtime when new links are created, we need to subscribe to events that are happening on the Link type. We’ll implement the subscription in the LinkList component since that’s where all the links are rendered.
  // The useQuery hook provided by Apollo gives us access to a function called subscribeToMore. We can destructure this function out and use it to act on new data that comes in over a subscription. This will give us the effect of making our app “realtime”.
  // 13) We’re passing in an object as the second argument to useQuery, right after we pass in the FEED_QUERY document. We can use this object to modify the behavior of the query in various ways. One of the most common things we do with it is to provide variables.
  const {
    data,
    loading,
    error,
    subscribeToMore
  } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
  });

  // 7) The subscribeToMore function takes a single object as an argument. This object requires configuration for how to listen for and respond to a subscription.
  // At the very least, we need to pass a subscription document to the document key in this object. This is a GraphQL document where we define our subscription.
 //We can also pass a field called updateQuery which can be used to update the cache, much like we would do in a mutation.
    //  9) Subscribing new votes
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.find(
          ({id}) => id === newLink.id
        );
        if (exists) return prev;
  
        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        });
      }
    });
  
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    });
  

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
