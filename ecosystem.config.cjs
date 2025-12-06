module.exports = {
  apps: [
    {
      name: 'onstock-payload-app',
      script: 'npm',
      args: 'run start',
      env_production: {
        HOST: '127.0.0.1',
        PORT: '3000',
        NODE_ENV: 'production',
      },
    },
  ],
}
