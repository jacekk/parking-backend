module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [
        {
            name: 'parkly-api',
            script: './index.js', // @todo move all js files to 'src' directory
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
