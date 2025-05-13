const logger = require('../config/logger');

const eventLogger = (req, res, next) => {
  // Log the incoming request
  logger.info('Event received', {
    endpoint: req.path,
    method: req.method,
    body: req.body,
    user: req.user,
    timestamp: new Date().toISOString()
  });

  // Store the original end function
  const originalEnd = res.end;

  // Override the end function
  res.end = function (chunk, encoding) {
    // Log the response
    logger.info('Event response', {
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      responseTime: Date.now() - req._startTime,
      timestamp: new Date().toISOString()
    });

    // Call the original end function
    originalEnd.call(this, chunk, encoding);
  };

  // Add start time to request
  req._startTime = Date.now();

  // Handle errors
  res.on('error', (error) => {
    logger.error('Event error', {
      endpoint: req.path,
      method: req.method,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });

  next();
};

module.exports = eventLogger;