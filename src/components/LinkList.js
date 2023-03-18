import React from 'react';
import Link from './Link';
// useQuery hook is used for  fetching, caching, and error handling of data.
/* gql is a function provided by the @apollo/client library for creating GraphQL queries, mutations, and subscriptions as plain JavaScript strings. 
This function allows you to define your GraphQL operation as a string literal within a template literal.
*/
import { useQuery, gql } from '@apollo/client';
const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`
;


const LinkList = () => {
    // This hook returns three items that are relevant for our purposes at this point:
    // 1. loading: Is true as long as the request is still ongoing and the response hasn’t been received.
    // 2. error: In case the request fails, this field will contain information about what exactly went wrong.
    // 3. xdata: This is the actual data that was received from the server. It has the links property which represents a list of Link elements.
    const { data } = useQuery(FEED_QUERY);
  
    return (
      <div>
        {data && (
          <>
            {data.feed.links.map((link) => (
              <Link key={link.id} link={link} />
            ))}
          </>
        )}
      </div>
    );
  };

// Mock data
// const LinkList = () => {
//   const linksToRender = [
//     {
//       id: 'link-id-1',
//       description:
//         'Prisma gives you a powerful database toolkit 😎',
//       url: 'https://prisma.io'
//     },
//     {
//       id: 'link-id-2',
//       description: 'The best GraphQL client',
//       url: 'https://www.apollographql.com/docs/react/'
//     }
//   ];

//   return (
//     <div>
//       {linksToRender.map((link) => (
//         <Link key={link.id} link={link} />
//       ))}
//     </div>
//   );
// };

export default LinkList;