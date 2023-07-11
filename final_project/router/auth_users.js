const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  var x = false;
  users.forEach((user) => {
    if (user.username === username) {
      x = true;
    }
  });
  return x;
};

const authenticatedUser = (username, password) => {
  let x = false;
  users.forEach((user) => {
    if (user.username === username && user.password === password) {
      x = true;
    }
  });
  return x;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Invalid request" });
  }
  let valid = isValid(req.body.username);
  if (!valid) {
    return res.status(400).json({ message: "User does not exist" });
  } else {
    let auth = authenticatedUser(req.body.username, req.body.password);
    if (auth) {
      const token = jwt.sign({ username: req.body.username }, "secret_key", {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

      return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (!req.query.review) {
    return res.status(400).json({ message: "Invalid request" });
  }
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    books[isbn].reviews[req.username] = req.query.review;
    return res
      .status(200)
      .json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    if (books[isbn].reviews[req.username]) {
      delete books[isbn].reviews[req.username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
