const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500);
    if (typeof err.message === 'object') {
        res.send({
            success: false,
            ...err.message
        });
    } else {
        res.send({
            success: false,
            message: err.message
        });
    }
  };
  
module.exports = errorHandler;
  