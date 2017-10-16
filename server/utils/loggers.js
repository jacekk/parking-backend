const { createLogger, format, transports } = require('winston');

const syncLogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.printf(
            info => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [
        new transports.File({
            filename: './logs/error.log',
            level: 'error',
        }),
        new transports.File({ filename: './logs/sync.log' }),
    ],
});

const dbDropLogger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.logstash()),
    transports: [new transports.File({ filename: './logs/dbDrop.log' })],
});

if (process.env.NODE_ENV !== 'production') {
    syncLogger.add(
        new transports.Console({
            format: format.colorize(),
        }),
    );
}

module.exports = {
    syncLogger,
    dbDropLogger,
};
