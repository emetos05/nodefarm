// Core
const fs = require('fs');
const http = require('http');
const url = require('url');

// Third-party
const slugify = require('slugify');

// Custom
const replaceTemplate = require('./modules/replaceTemplate');

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is my first write ${textIn}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// File read
const overviewData = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const cardData = fs.readFileSync(`${__dirname}/templates/cards.html`, 'utf-8');
const productData = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

// const slugs = dataObject.map((slug) =>
//   slugify(slug.productName, { lower: true })
// );
// console.log(slugs);

// Server creation and getting data from local API
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const cardsHtml = dataObject
      .map((item) => replaceTemplate(cardData, item))
      .join('');
    const output = overviewData.replace('%PRODUCT_CARDS%', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObject[query.id];
    const output = replaceTemplate(productData, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);

    // Page not found
  } else {
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end('Page Not Found');
  }
});

server.listen(8000, 'localhost', () => {
  console.log('Listening on port 8000');
});
