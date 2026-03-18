


// middleware/auth.js

const auth = (req, res, next) => {
  const isLoggedIn = true; // change to false to test

  if (isLoggedIn) {
    console.log("User authenticated");
    next(); // allow request
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = auth; // ✅ this line is critical