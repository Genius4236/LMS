/** 404 handler for unknown API routes */
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

/** Global error handler */
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
