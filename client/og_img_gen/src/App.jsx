import React from 'react'
import PostPage from './Components/PostPage'

export default function App() {
      const post = {
    title: 'Sample Post Title',
    content: 'This is a sample post content.',
    imageUrl: 'https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=600',
  };

  return <PostPage post={post} />;
}
