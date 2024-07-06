const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const serveStaticFile = (filePath, res) => {
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('File not found');
            } else {
                res.statusCode = 500;
                res.end('Server error');
            }
            return;
        }
        res.setHeader('Content-Type', contentType);
        res.statusCode = 200;
        res.end(data);
    });
};

const requestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/') {
        // Serve the home page
        serveStaticFile(path.join(__dirname, 'public', 'index.html'), res);
    } else if (pathname === '/styles.css') {
        // Serve the styles.css file
        serveStaticFile(path.join(__dirname, 'public', 'styles.css'), res);
    } else if (pathname === '/allmovies') {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200;
        res.end('List of all movies');
    } else if (pathname.startsWith('/movie/')) 
    {
        
        const movieId = pathname.split('/')[2];
    const filePath = path.join(__dirname, 'public', 'movie.html');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        
        // Replace the placeholder with the actual movie ID
        const modifiedHtml = data.replace('{{MOVIE_ID}}', movieId);
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modifiedHtml);
    });



    } else if (pathname === '/categories') {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200;
        res.end('List of all categories');
    } else if (pathname.startsWith('/category/')) {
        const categoryName = pathname.split('/')[2];
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200;
        res.end(`Movies in category: ${categoryName}`);
    } else {
        // Serve static files from the 'public' directory
        const filePath = path.join(__dirname, 'public', pathname);
        serveStaticFile(filePath, res);
    }
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
