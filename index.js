const { log } = require('console');
const http = require('http');
const https = require('https');


const PORT =  3000;


function getLatestTimeStories(callback) {
    const url = 'https://time.com';
    
    https.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            
          
            const latestStories = extractLatestStories(data);
            console.log(latestStories);
            callback(latestStories);
        });
    }).on('error', (error) => {
        console.error(`Error fetching Time.com: ${error.message}`);
        callback([]);
    });
}


function extractLatestStories(html) {
    const stories = [];
    const titlePattern = /<h2 class="title">([^<]+)<\/h2>/g;
    const linkPattern = /<a href="([^"]+)"/g;
    
    let match;
    while ((match = titlePattern.exec(html)) !== null) {
        const title = match[1].trim();
        const linkMatch = linkPattern.exec(html);
        const link = linkMatch ? linkMatch[1] : '';
        stories.push({ title, link });
    }

    return stories.slice(0, 6); 
}

const server = http.createServer((req, res) => {
    if (req.url === '/getTimeStories' && req.method === 'GET') {
      
        getLatestTimeStories((latestStories) => { 
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(latestStories));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

 server.listen(PORT, () => {
     console.log(`Server is runningb at this ${PORT}`)
 })

