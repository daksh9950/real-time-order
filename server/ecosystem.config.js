module.exports = {
  apps: [
    {
      name: 'realtime-orders',
      script: 'server.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
