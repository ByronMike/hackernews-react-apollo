import React, { useState } from 'react';
// 0) useLazyQuery : we actually want to load the data every time the user hits the OK button, not upon the initial load of the component. To do this, we’ll use a hook supplied by Apollo called useLazyQuery. This hook performs a query in the same way the useQuery hook does but the difference is that it must be executed manually. This is perfect for our situation––we want to execute the query when the OK button is clicked.
import { useLazyQuery, gql } from '@apollo/client';
import Link from './Link';

// 1) Add the query : This query looks similar to the feed query that’s used in LinkList. However, this time it takes in an argument called filter that will be used to constrain the list of links we want to retrieve.
const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      id
      links {
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
  }
`;

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  // 2) useLazyQuery implementation
  const [executeSearch, { data }] = useLazyQuery(
    FEED_SEARCH_QUERY);
  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        {/* 3) Button ok logic implementation */}
        <button
          onClick={() =>
            executeSearch({
              variables: { filter: searchFilter }
            })
          }
        >
          OK
        </button>
      </div>
      {data &&
        data.feed.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
    </>
  );
};

export default Search;