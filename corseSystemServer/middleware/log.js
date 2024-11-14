// logger.js

const logger = require('morgan');
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../daily.log'), { flags: 'a' });

// Standard Apache combined log output. Time in China +8h
const combinedLogger = logger('combined', { stream: accessLogStream });

module.exports = combinedLogger;
