module.exports = {
  apps: [
    // {
    //   name: "carbi-frontend",
    //   script: "carbi/server-build/server.js",
    //   cwd: './CLIENT',
    //   env: {
    //     NODE_ENV: "production",
    //   },
    //   env_production: {
    //     NODE_ENV: "production",
    //   }
    // },
    // {
    //   name: "carbi-http-server",
    //   script: "carbi/BUILD/HTTP/server.js",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    //   env_production: {
    //     NODE_ENV: "production",
    //   }
    // },
    // {
    //   name: "carbi-io-server",
    //   script: "carbi/BUILD/IO/io-server.js",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    //   env_production: {
    //     NODE_ENV: "production",
    //   }
    // },
    // {
    //   name: "carbi-bot-server",
    //   script: "carbi/BUILD/BOT/bot-server.js",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    //   env_production: {
    //     NODE_ENV: "production",
    //   }
    // },
    // {
    //   name: "carbi-collector-server",
    //   script: "carbi/BUILD/COLLECTOR/server.js",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    //   env_production: {
    //     NODE_ENV: "production",
    //   }
    // },
    // Watch_me
    {
      name: "watch_me_server",
      script: "./index.js",
      cwd: './watch_me/build',
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      name: "watch_me_site",
      script: "npm",
      args: "run start",
      cwd: './watch_me/Watch_me_site',
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
  ],
};
