module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [
        {
            name: 'parkly-api',
            script: './start.js',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            env: {
                SERVE_PORT: 4000,
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
