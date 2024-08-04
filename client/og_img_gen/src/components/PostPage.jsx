import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const PostPage = ({ post }) => {
  const { title, content, imageUrl } = post;

  useEffect(() => {
    // Set meta tags for OG image
    document.querySelector('meta[property="og:image"]').setAttribute('content', `http://localhost:3000/og-image?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&imageUrl=${encodeURIComponent(imageUrl)}`);
  }, [title, content, imageUrl]);

  return (
    <div className="post-page">
      <Helmet>
        <meta property="og:image" content="" />
        {/* Add other meta tags as needed */}
      </Helmet>
      <h1>{title}</h1>
      <p>{content}</p>
      {imageUrl && <img src={imageUrl} alt="Post" />}
    </div>
  );
};

export default PostPage;
