module.exports = {
    apps : [{
      name: "miweb",
      script: "src/index.js",
      watch: false,
      max_memory_restar: '1000M',
      exec_mode:"cluster",
      instances:1,
      cron_restar: "* * * * *",
      env: {
        NODE_ENV: "development",
      },
      env:{
        NODE_ENV: "production"
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }
  