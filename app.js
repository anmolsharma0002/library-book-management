const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const { whitelist } = require('./config/whitelist');
const errorHandler = require('./middlewares/errorHandler');
const env = require('./config/env');
const connectDB = require('./config/db');

var corsOptions = {
    origin: function (origin, callback) {
        // console.log(origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    }
};

// Applying CORS middleware for HTTP requests
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }));

/** -- Set limit and the size of the request in application/x-www-form-urlencoded -- */
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json());

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
    next();
});


app.get('/', (req, res, next) => {
    res.send('Hello!! Welcome')
})

app.use('/api', require('./api'));

/** -- IF No Route Found */
app.use((req, res, next) => {
    next(createError(404, 'Route Not found'));
});

/** -- Error handler Middleware  -- */
app.use(errorHandler);

// Call the connectDB function before starting the server
connectDB().then(() => {
    app.listen(env.port, error => {
        if (error) {
            console.log(env.nodeEnv + ' Error On Listening at ' + env.port + ' :: ERROR :: ' + error);
        } else {
            console.log(env.nodeEnv + ' Running At ' + env.port);
        }
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});