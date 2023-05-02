import React from 'react';
// 0) Voting feature 
import { AUTH_TOKEN } from '../constants';
// 0bonus) Import the utilitary to compute time spent
import { timeDifferenceForDate } from '../utils';
// 7) Import useMutation hook and gql
import { useMutation, gql } from '@apollo/client';
// 11° Import feed_query
import { FEED_QUERY } from './LinkList';
// 12) Update the update function on the useMutation hook
import { LINKS_PER_PAGE } from '../constants';

// 4) Mutation definition
const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
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

// Destructuring : const link = props.link
const Link = (props) => {
  const { link } = props;
  // 1) Voting feature
  const authToken = localStorage.getItem(AUTH_TOKEN);
  // 5) useMutation hook to do the voting
  // Note : We’ll call the function that runs the mutation vote and will pass the VOTE_MUTATION GraphQL mutation to it.

  // 12) Update the update function (2)
  const take = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = { createdAt: 'desc' };

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
		// 8) Cache : This runs after the mutation has completed and allows us to read the cache, modify it, and commit the changes. 
    update: (cache, {data: {vote}}) => {
			// We’re calling cache.readQuery and passing in the FEED_QUERY document. This allows us to read the exact portion of the Apollo cache that we need to allow us to update it.
      const { feed } = cache.readQuery({
        // 13)  Update the update function (3)
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy
        }
      });

			// 9) Once we have the cache, we create a new array of data that includes the vote that was just made. The vote that was made with the mutation is destructured out using { data: { vote } }
      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

			// 10) Once we have the new list of votes, we can commit the changes to the cache using cache.writeQuery, passing in the new data.
      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks
          }
        },
        // 14) Update the update function (4)
        variables: {
          take,
          skip,
          orderBy
        }
      });
    }
  });
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        {/* Index du message initialisé à 1 */}
        <span className="gray">{props.index + 1}.</span>
        {/* 2) Vote button */}
        {/* 6) Set the vote click button */}
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: 'pointer' }}
            onClick={vote}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {/* 3) Display votes for each link with the name of the user who posted it */}
        {(
          <div className="f6 lh-copy gray">
            {link.votes.length} votes | by{' '}
            {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
            {/* timeDifferenceForDate passed the createdAt information for each link. The function will take the timestamp and convert it to a string that’s more user friendly, e.g. "3 hours ago". */}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Link;