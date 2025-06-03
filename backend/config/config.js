require('dotenv').config();

module.exports = {
  development: {
    username: "postgres",
    password: "09077990572",
    database: "wehelp",
    host: "localhost",
    dialect: "postgres"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
