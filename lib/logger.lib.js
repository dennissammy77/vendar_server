const winston = require('winston');
const { combine, timestamp, label, prettyPrint, colorize } = winston.format;

const logger = winston.createLogger({
    format: combine(
        label({ label: 'development' }),
        timestamp(),
        prettyPrint(),
        colorize()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    ],
});

module.exports = logger;