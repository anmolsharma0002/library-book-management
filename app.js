// Importing the required modules
const express = require('express');  // Express framework for building web applications
const app = express();               // Initializing the express application
const cors = require('cors');        // CORS middleware to enable Cross-Origin Resource Sharing
const bodyParser = require('body-parser');  // Middleware to parse incoming request bodies
const createError = require('http-errors'); // Utility to create HTTP errors

// Importing custom configurations and middleware
const { whitelist } = require('./config/whitelist'); // Importing a list of allowed origins for CORS
const errorHandler = require('./middlewares/errorHandler'); // Global error handler middleware
const env = require('./config/env'); // Environment configuration (port, environment variables)
const connectDB = require('./config/db'); // Database connection configuration (MongoDB)

// CORS configuration options
var corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is in the whitelist or if there's no origin (for non-browser requests)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS'), false); // Block the request
        }
    }
};

// Applying CORS middleware for handling HTTP requests from different origins
app.use(cors(corsOptions));

// Body-parser middleware to handle JSON payloads and URL-encoded data
app.use(bodyParser.json({ limit: '50mb' })); // Setting the request body size limit to 50MB for JSON
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // For form-urlencoded data

// Reapplying bodyParser.json for safety (can be omitted if redundant)
app.use(bodyParser.json());

// Middleware to set custom CORS headers for all incoming requests
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
    res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies, etc.)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH"); // Allowed HTTP methods
    next(); // Proceed to the next middleware or route handler
});

// Define a simple route handler for the root URL ('/')
app.get('/', (req, res, next) => {
    res.send('Hello!! Welcome'); // Responds with a greeting message
});

// API routes - Use API route handler from an external module
app.use('/api', require('./api')); // All '/api' requests will be handled by routes defined in './api'

// Middleware to handle requests to undefined routes (404 error)
app.use((req, res, next) => {
    next(createError(404, 'Route Not found')); // Passes a 404 error to the next middleware
});

// Error handler middleware - All errors will be processed here
app.use(errorHandler);

// Connect to MongoDB before starting the server
connectDB().then(() => {
    // Start the server once the database connection is successful
    app.listen(env.port, error => {
        if (error) {
            // If there's an error starting the server, log it
            console.log(env.nodeEnv + ' Error On Listening at ' + env.port + ' :: ERROR :: ' + error);
        } else {
            // If successful, log the environment and port number
            console.log(env.nodeEnv + ' Running At ' + env.port);
        }
    });
}).catch(error => {
    // If there's an error connecting to MongoDB, log it and exit the process
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with a failure code
});
