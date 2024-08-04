const express = require('express');
const app = express();

const puppeteer = require('puppeteer');

const generateOgImage = async (postContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load HTML content and style it
  const htmlContent = `
    <html>
      <head>
        <style>
          /* Add your CSS styles here */
        </style>
      </head>
      <body>
        <div class="post">
          <h1>${postContent.title}</h1>
          <p>${postContent.content}</p>
          <img src="${postContent.imageUrl}" alt="Post Image"/>
        </div>
      </body>
    </html>
  `;

  await page.setContent(htmlContent);
  await page.setViewport({ width: 1200, height: 630 });
  const imageBuffer = await page.screenshot({ type: 'png' });

  await browser.close();
  return imageBuffer;
};


app.get('/og-image', async (req, res) => {
  const postContent = {
    title: req.query.title || 'Default Title',
    content: req.query.content || 'Default Content',
    imageUrl: req.query.imageUrl || ''
  };

  const imageBuffer = await generateOgImage(postContent);
  res.set('Content-Type', 'image/png');
  res.send(imageBuffer);
});

app.listen(3000, () => console.log('Server running on port 3000'));
