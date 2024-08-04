import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

const PostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ogImg, setOgImg] = useState('');

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleImageUrlChange = (e) => setImageUrl(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryString = new URLSearchParams({
      title: title,
      content: content,
      imageUrl: imageUrl,
    }).toString();

    const ogImageUrl = `http://localhost:3000/og-image?${queryString}`;
    setOgImg(ogImageUrl);

    console.log('OG Image URL:', ogImageUrl);

  };

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className="post-page">
      <Helmet>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={content.slice(0, 100)} /> 
        {imageUrl && <meta property="og:image" content={imageUrl} />}
      </Helmet>
      <h1>Create a Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} required />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={content} onChange={handleContentChange} required></textarea>
        </div>
        <div>
          <label>Image URL:</label>
          <input type="text" value={imageUrl} onChange={handleImageUrlChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {ogImg !== '' && <a href={ogImg} target="_blank" rel="noopener noreferrer">Link to OG Image</a>}
      {imageUrl && <img src={imageUrl} alt="Post" style={{ marginTop: '20px', maxWidth: '100%' }} />}
    </div>
  );
};

export default PostPage;
