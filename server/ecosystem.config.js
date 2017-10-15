module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'parkly-api',
      script    : './index.js', // @todo move all js files to 'src' directory
    },
  ],
};
