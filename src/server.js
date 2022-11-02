require("express-async-errors");

const express = require("express");

const app = express();
const port = 3333;

app.use(express.json());

app.listen(port, showServerStatus);

/**
 * Show the server status
 */
function showServerStatus() {
  console.log(`Server is running on ${port}`);
}
