const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const redisSubscriber = redisClient.duplicate();

function fib(index) {
    if (index < 2) return index;
    return fib(index - 1) + fib(index - 2);
}

// catching error
redisClient.on('error', function(err) {
    console.log('Error: ', err);
})

// Constantly listen for new index published to redis
// Recalculate if it has never been calculated before
// Save new value to hset `values`
redisSubscriber.on('message', (channel, index) => {
    // if (channel === 'insert') {
    //     index = parseInt(index);
    //     redisClient.hget('values', index, function(value) {
    //         if (!value) {
    //             redisClient.hset('values', message, fib(index))
    //         }
    //     })
    // }
    redisClient.hset('values', index, fib(parseInt(index)))
}) 

// Register as a listener for insert channel from redis
redisSubscriber.subscribe('insert', (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log('Worker has subscribed to Redis `insert` channel')
});