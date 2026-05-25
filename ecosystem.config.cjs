// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: "spoilert-web",
      script: "./standalone/server.js",
      cwd: "/var/www/spoilert-web-app",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
