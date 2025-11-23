module.exports = {
  apps: [
    {
      name: 'zestawienia',
      script: './dist/main.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3005,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005,
        UPLOAD_PATH: 'uploads',
        TYPEORM_SYNCHRONIZE: 'false',
      },
    },
  ],
};
