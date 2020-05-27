const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

//use middleware functino 'verifyToken'
app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    //token is now in the req object.
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created...",
        authData, //authData is the user information.
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  //Mock user - usually, frontend would send the data
  const user = {
    id: 1,
    username: "brad",
    email: "brad@gmail.com",
  };

  //jwt.sign({payload}, "secretkey"), callback => {send json response containing the token}
  jwt.sign({ user: user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
    //token expiration parameter is optional.
    res.json({
      token: token,
    });
  });
});

//FORMAT OF TOKEN:
//Authorization: Bearer <access_token>  //<access_token> is the token generated from jet.sign() in the /api/login POST.

//Verify Token
function verifyToken(req, res, next) {
  //Get auth header value - we want to send the token in the header as an authorization value
  const bearerHeader = req.headers["authorization"]; //should give us the actual token
  //Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(" "); //new array would have <access_token> as the second value
    //Get token from array
    const bearerToken = bearer[1];
    //Set the token
    req.token = bearerToken;
    //Next middleware
    next();
  } else {
    //Forbidden - if no token is sent
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log("Server started on port 5000"));
