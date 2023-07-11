const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBookByAuthor(author) {
  for (const [id, book] of Object.entries(books)) {
    if (book.author === author) {
      return { id, ...book };
    }
  }
  return null; // Return null if no book with the specified author is found
}
function getBookByTitle(title) {
  for (const [id, book] of Object.entries(books)) {
    if (book.title === title) {
      return { id, ...book };
    }
  }
  return null;
}

public_users.post("/register", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Invalid request" });
  }
  console.log(users);
  let valid = isValid(req.body.username);
  if (valid) {
    return res.status(400).json({ message: "User already exists" });
  } else {
    users.push(req.body);
    return res
      .status(200)
      .json({ message: "User registered successfully. You can login" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let book = getBookByAuthor(author);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let book = getBookByTitle(title);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
