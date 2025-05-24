// errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error details for debugging
  
    // Set the status code based on the error
    const statusCode = err.statusCode || 500;
    
    // Send a standardized error response
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  };
  
  module.exports = errorHandler;
  