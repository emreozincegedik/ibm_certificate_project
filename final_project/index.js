const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  let token = req.headers.cookie;
  const tokenStartIndex = token.indexOf("token=");

  if (tokenStartIndex !== -1) {
    token = token.slice(tokenStartIndex + 6, token.length);
    const decoded = jwt.verify(token, "secret_key");

    // Attach the decoded user information to the request object
    req.username = decoded.username;

    // Continue to the next middleware or route
    next();
  } else {
    return res.status(401).json({ error: "Invalid token" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
