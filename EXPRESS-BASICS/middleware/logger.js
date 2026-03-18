
const logger = (req, res, next) => {
  console.log("Request received at:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  next(); // VERY IMPORTANT
};

module.exports = logger;


