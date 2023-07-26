var mysql = require("mysql2");
const MYSQL_INFO = {
  host: "localhost",
  user: "root",
  password: "test123",
  database: "chatdb",
};
var db = mysql.createConnection(MYSQL_INFO);

db.connect();

module.exports = {
  db,
  MYSQL_INFO,
};
