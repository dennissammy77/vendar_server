const winston = require('winston');

const Logger=(payload)=>{
    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console(),
            //new winston.transports.Console(),
        ]
    });
    logger.log({
        level: payload?.level,
        message: payload?.message
    })
}

module.exports = Logger;