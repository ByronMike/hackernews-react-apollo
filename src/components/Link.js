import React from 'react';

const Link = (props) => {
 // Destructuring : const link = props.link
  const { link } = props;
  return (
    <div>
      <div>
        {link.description} ({link.url})
      </div>
    </div>
  );
};

export default Link;