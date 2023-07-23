var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test123",
  database: "chatdb",
});

connection.connect();

connection.query("SELECT * FROM user", function (error, results, fields) {
  if (error) {
    console.log(error);
  }
  console.log(results);
});

connection.end();
