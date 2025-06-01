import { Sequelize } from "sequelize";
import "dotenv/config";

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const db = new Sequelize(database, user, password, {
  host,
  port,
  dialect: "postgres",
  logging: false, 
});

(async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default db;
