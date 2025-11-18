const { StatusCodes } = require("http-status-codes");

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: "Error processing request",
    error: err.message || "Something went wrong",
    validationErrors: err.validationErrors || [],
  });
};

module.exports = errorMiddleware;
