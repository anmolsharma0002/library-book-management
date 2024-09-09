// Middleware for handling errors in the application
const errorHandler = (err, req, res, next) => {
    // Log the stack trace of the error to the console for debugging
    console.error(err.stack);

    // Set the response status code to the error's status or default to 500 (Internal Server Error)
    res.status(err.status || 500);

    // Check if the error message is an object
    if (typeof err.message === 'object') {
        // Send a JSON response with the error details
        res.send({
            success: false,
            ...err.message // Spread the properties of the error message object
        });
    } else {
        // Send a JSON response with the error message
        res.send({
            success: false,
            message: err.message // Send the error message directly
        });
    }
};

// Export the errorHandler middleware
module.exports = errorHandler;
