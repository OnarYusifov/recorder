module.exports = {
  apps: [
    {
      name: 'trayb-recorder-1',
      script: 'src/bot.js',
      args: '1',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/bot1-error.log',
      out_file: './logs/bot1-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'trayb-recorder-2',
      script: 'src/bot.js',
      args: '2',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/bot2-error.log',
      out_file: './logs/bot2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};

