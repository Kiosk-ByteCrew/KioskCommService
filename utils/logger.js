const logger = {
    info: (msg) => {
        console.log(`INFO: ${msg}`);
    },
    error: (msg) => {
        console.error(`ERROR: ${msg}`);
    },
    stream: {
        write: (message) => {
            logger.info(message.trim());
        },
    },
};

module.exports = logger;
