import React, { useState } from "react";
// 1) Import useMutation (fire the mutation) and gql
import { useMutation, gql } from "@apollo/client";
// 4) useNavigate Hook
import { useNavigate } from "react-router-dom";
// 8) Import feed query
import { FEED_QUERY } from './LinkList';

// 2) Create a mutation (post) to post description and url
const CREATE_LINK_MUTATION = gql`
  # PostMutation is a graphQL mutation operation to post data
  mutation PostMutation($description: String!, $url: String!) {
    # The mutation operation sends these arguments to a GraphQL server to create a new post object that includes the description, url, id, and createdAt fields.
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  // 5) Creation of the navigate reference
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    description: "",
    url: "",
  });

  // 3) Pass the CREATE_LINK_MUTATION  as
  //  1) first argument : the GraphQL mutation operation) to the useMutation hook and then pass the data provided by the inputs
  //  2) the second argument : an object with various properties related to the mutation operation).
  // Note : When we use the useMutation hook, we need to destructure out a function that can be used to call the mutation. That’s what createLink is in the code block above. We’re now free to call the function whenever we need to when the component renders.
  // A NOTER : createLink is between [] (destructuring) to extract the first element of the array (mutation function) and assign it this variable name => createLink is a function that is extracted from an array using the destructuring syntax.
  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url,
    },
    // 7) Add an update callback to the useMutation hook to update the Apollo store.
    // Note : The update function works in a very similar way as before. We first read the current state of the results of the FEED_QUERY. Then we insert the newest link at beginning and write the query results back to the store. Note that we need to pass in a set of variables to the readQuery and writeQuery functions. It’s not enough to simply pass the FEED_QUERY query document in, we also need to specify the conditions of the original query we’re targeting. In this case, we pass in variables that line up with the initial variables we passed into the query in LinkList.js.
    update: (cache, { data: { post } }) => {
      const data = cache.readQuery({
        query: FEED_QUERY,
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [post, ...data.feed.links]
          }
        },
      });
    },
    // 6) Use of the onCompleted function that is provided by Apollo when mutations are performed to return on home after mutation resolved
    onCompleted: () => navigate("/"),
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value,
              })
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={formState.url}
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value,
              })
            }
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateLink;
