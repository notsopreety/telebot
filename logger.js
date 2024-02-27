const logger = (message, color, includeTimestamp = true) => {
  let logMessage = message;
  if (includeTimestamp) {
      logMessage = `[${new Date().toLocaleString()}] ${logMessage}`;
  }
  // Log to the console with color
  switch (color) {
      case 'red':
          console.log('\x1b[31m%s\x1b[0m', logMessage); // Red
          break;
      case 'green':
          console.log('\x1b[32m%s\x1b[0m', logMessage); // Green
          break;
      case 'yellow':
          console.log('\x1b[33m%s\x1b[0m', logMessage); // Yellow
          break;
      default:
          console.log(logMessage); // Default
  }
};

module.exports = logger;
