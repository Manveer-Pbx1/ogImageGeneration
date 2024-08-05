import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';

const PostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ogImg, setOgImg] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const easyMDE = new EasyMDE({
        element: contentRef.current,
        autoDownloadFontAwesome: true,
        maxHeight: "50px",
        placeholder: "Write your content here...",
        spellChecker: false,
        hideIcons: ["guide", "fullscreen", "image"],
        shortcuts: {
          "drawTable": "Ctrl-Alt-T",
        },
      });

      easyMDE.codemirror.on('change', () => {
        setContent(easyMDE.value());
      });

      return () => {
        easyMDE.toTextArea();
      };
    }
  }, []);

  const handleTitleChange = (e) => setTitle(e.target.value);
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
    <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-md max-w-4xl">
      <Helmet>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={content.slice(0, 100)} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
      </Helmet>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder='Title'
            required
            className='bg-white border border-gray-300 rounded-md text-2xl px-4 py-2 focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className="flex flex-col">
          <textarea
            ref={contentRef}
            className='bg-white border border-gray-300 rounded-md text-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
            placeholder='Body Text'
            required
          ></textarea>
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            value={imageUrl}
            placeholder='Enter Image URL (optional)'
            className='bg-white border border-gray-300 rounded-md text-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500'
            onChange={handleImageUrlChange}
          />
        </div>
        <button
          type="submit"
          className='bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300'
        >
          Post
        </button>
      </form>
      {ogImg && (
        <div className="mt-4">
          <a href={ogImg} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View OG Image
          </a>
        </div>
      )}
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Post" className='h-[200px] w-[200px] mr-auto ml-auto rounded-md shadow-sm' />
        </div>
      )}
    </div>
  );
};

export default PostPage;
