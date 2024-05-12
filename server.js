const redis = require('redis');
const Queue = require('bull');
(async () => {

  let myQueue;
  const client = redis.createClient({
    username: 'default',
    password: 'AVNS_5Nq43KX2sLCZ2v1Dyvt',
    host: 'db-redis-blr1-35101-do-user-16484816-0.c.db.ondigitalocean.com',
    port: 25061
  });

  myQueue = new Queue('myQueue', { redis: client });

  const subscriber = client.duplicate();

  await subscriber.connect();

  await subscriber.subscribe('article', (message) => {
    const d = JSON.parse(message);
    console.log("🚀 ~ awaitsubscriber.subscribe ~ d:", d);
    const startTime = Date.now();
    console.log("🚀 ~ awaitsubscriber.subscribe ~ startTime:", startTime)
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