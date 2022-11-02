require("express-async-errors");

const AppError = require("./utils/AppErrors");
const express = require("express");
const routers = require("./routers");

const app = express();
const port = 3333;

app.use(express.json());
app.use(routers);

/**
 * Manipulate error and how application works with each error,
 *  first check if the error is a instance of AppError and thrown a error
 *  sended by AppError instance, if isn't a AppError, then show the error
 *  in console and return the status error in json format.
 */
app.use((error, _request, response, _next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: error,
      message: error.message
    });
  };

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});


app.listen(port, showServerStatus);

/**
 * Show the server status
 */
function showServerStatus() {
  console.log(`Server is running on ${port}`);
}
