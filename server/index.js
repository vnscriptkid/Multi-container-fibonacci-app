const keys = require('./keys');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// pg client
const {Pool} = require('pg');
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDb,
    user: keys.pgUser,
    password: keys.pgPassword
})

pgClient.on('error', () => console.log('Lost PG connection'));

// create new table
pgClient.query('CREATE TABLE IF NOT EXISTS indexes (number INT)')
    .then(result => console.log('Created table `indexes` successfully', result))
    .catch(err => console.log(err));

// redis client

const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate();

// testing
app.get('/', (req, res) => {
    res.send({ it: 'works' });
})

// get all the indexes that has been queried
app.get('/indexes', async (req, res) => {
    try {
        const values = await pgClient.query('SELECT * FROM indexes');
        res.send(values.rows);
    } catch (e) {
        res.send(e);
    }
})

// get all the values that has been calculated
app.get('/values', (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        if (err) {
            res.send(err);
            return;
        }
        // return null if there's no value
        res.send(values);
    })
})

app.post('/indexes', async (req, res) => {
    const index = parseInt(req.body.index);

    if (parseInt(index) > 40) {
        res.status(422).send('Index too high');
        return;
    }

    // save index to pg async
    pgClient.query('INSERT INTO indexes(number) VALUES($1)', [index]);

    // publish to redis
    redisPublisher.publish('insert', index);

    res.send({ working: true })
} )

const port = 5000;
app.listen(port, () => {
    console.log(`Express Server is listening on port ${port}`);
})