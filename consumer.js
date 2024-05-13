require('dotenv').config();

const redis = require('redis');
const Queue = require('bull');
(async () => {

  let myQueue;
  const client = redis.createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  });

  myQueue = new Queue('myQueue', { redis: client });

  const subscriber = client.duplicate();

  await subscriber.connect();

  await subscriber.subscribe('article', (message) => {
    const d = JSON.parse(message);
    const startTime = Date.now();
    const latency = startTime - new Date(d.time);
    console.log('Latency:', latency, 'ms');
  });

  myQueue.process((job) => {
    console.log('Received message:', job.data.message);
    // Process the message here
  });

  myQueue.on('completed', function (job, result) {
    console.log('completed job:', job.data.message);
  })

})();