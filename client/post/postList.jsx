/* eslint-disable react/no-array-index-key,react/prop-types */
import React from 'react';
import Post from './post';

function PostList(props) {
  return (
    <div style={{ marginTop: '24px' }}>
      {props.posts.map((item, i) => (
        <Post
          post={item}
          key={i}
          onRemove={props.removeUpdate}
        />
      ))}
    </div>
  );
}

export default PostList;
