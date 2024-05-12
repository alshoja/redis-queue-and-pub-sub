const http = require('http');
const redis = require('redis');
const url = require('url');
const Queue = require('bull');

let myQueue;
const publisher = redis.createClient({
    username: 'default',
    password: 'AVNS_5Nq43KX2sLCZ2v1Dyvt',
    host: 'db-redis-blr1-35101-do-user-16484816-0.c.db.ondigitalocean.com',
    port: 25061
});
myQueue = new Queue('myQueue', { redis: publisher });
(async () => {
    await publisher.connect();

})();



// Create Server 1
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Handle only GET requests to /send-message route
    if (req.method === 'GET' && parsedUrl.pathname === '/send-message') {
        const message = parsedUrl.query.message;

        if (!message) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Bad Request: Message parameter is missing\n');
        }

        // Publish the received message to the 'messages' channel
        // Ensure that the Redis client is connected before publishing
        const article = {
            time: Date.now()
        };

        await publisher.publish('article', JSON.stringify(article));
        myQueue.add({ message: 'Hello from Server 1!' });

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Message "${message}" published to Redis!\n`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found\n');
    }
});

// Define the port for Server 1
const PORT = 3001;

// Start listening on Server 1
server.listen(PORT, () => {
    console.log(`Server 1 is running on port ${PORT}`);
});
