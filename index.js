
const https = require('https');
const http = require('http');

const PORT = 5000;

function getStories(callback) {
    const timeURL = 'https://time.com/';

    https.get(timeURL, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            

            const latestStories = [];
            let c = 0;


            const matchingElement = /<li class="latest-stories__item">[\s\S]*?<a href="([^"]+)">[\s\S]*?<h3 class="latest-stories__item-headline">([\s\S]*?)<\/h3>/g;
            let match;

            while ((match = matchingElement.exec(data)) !== null && c < 6) {
                const storyUrl = match[1];
                const storytitle = match[2].trim();
                latestStories.push(
                    { 
                        storytitle, url: 'https://time.com' + storyUrl 
                    });

                c++;
            }

            callback(latestStories)

        });
    })
    .on('error', (error) => {
        
        console.error('Error fetching Time stories:', error);
        callback([]);
    });
}



const server = http.createServer((req, resp) => {
    
    if (req.url === '/getTimeStories') {

        getStories((stories) => {
            console.log('stories:', stories)
            resp.writeHead(200, { 'Content-Type': 'application/json' });
            resp.end(JSON.stringify(stories));
        });
    } else {
        resp.writeHead(404, { 'Content-Type': 'text/plain' });
        resp.end('Not Found');
    }
}); 


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});