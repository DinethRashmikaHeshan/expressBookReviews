const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,3));  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(b => b.author === author);
  
    if (booksByAuthor.length > 0) {
      res.json({ books: booksByAuthor });
    } else {
      res.status(404).json({ message: "Books by the author not found." });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(b => b.title === title);
  
    if (booksByTitle.length > 0) {
      res.json({ books: booksByTitle });
    } else {
      res.status(404).json({ message: "Books by the title not found." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const booksByIsbn = Object.values(books[isbn])
  
    if (booksByIsbn.length > 0) {
      res.json({ books: booksByIsbn.review });
    } else {
      res.status(404).json({ message: "Book not found to that isbn" });
    }
});

module.exports.general = public_users;
