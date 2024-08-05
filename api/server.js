const express = require("express");
const puppeteer = require("puppeteer");
const {marked} = require('marked');
const app = express();
const generateOgImage = async (title, content, imageUrl) => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  const contentHtml = marked(content);
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
          .container { width: 1200px; height: 630px; position: relative; padding: 20px; box-sizing: border-box; }
          h1 { font-size: 48px; margin: 0; }    
          p { font-size: 24px; 
            overflow: hidden;
             display: -webkit-box;
            -webkit-line-clamp: 9;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis; }
             .image-wrapper {
             height: 600px;
             position: absolute;
                width: 1300px;
                top:20%;
            background: ${content.split('\n').length > 9 ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.7) 100%)' : 'none'};
            border-radius: 5px;
            z-index: 100;
          }
          img { position: absolute; transform: translateY(-15px); z-index: -1; transform: translateX(280px); border-radius: 5px;
          box-shadow: 5px 0px 5px; margin-right: auto;}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${title}</h1>
          <div class="image-wrapper"></div>
          <div>${contentHtml}</div>
          ${imageUrl ? `<img src="${imageUrl}" alt="Post Image"/>` : ""}
        </div>
      </body>
    </html>
  `;

  await page.setContent(htmlContent);
  await page.setViewport({ width: 1200, height: 630 });
  const imageBuffer = await page.screenshot({ type: "png" });

  await browser.close();
  return imageBuffer;
};

app.get("/og-image", async (req, res) => {
  const title = req.query.title || "Default Title";
  const content = req.query.content || "Default Content";
  const imageUrl = req.query.imageUrl || "";

  try {
    const imageBuffer = await generateOgImage(title, content, imageUrl);
    res.set("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error generating OG image:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
