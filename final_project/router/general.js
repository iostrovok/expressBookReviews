const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if the user exists
const doesExist = (username) => {
    return users.filter((user) => {
        return user.username === username;
    }).length > 0;
};

public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username) && !doesExist(username)) {
            users.push({
                'username': username,
                'password': password,
            });

            return res.status(200).json({message: 'User successfully registered. Now you can login'});
        }

        return res.status(404).json({message: 'User already exists!'});
    }

    return res.status(404).json({message: 'Unable to register user.'});
});

// Get the all books as list available in the shop
public_users.get('/', function(req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve, reject) => {
        resolve(books); // search and return all books
        reject({message: 'No books'}); // return DB error
    });

    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((books) => {
        res.status(200).json(books);
    }).catch(err => {
        res.status(404).json(err);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            reject({message: 'No books'}); // return DB error
        }

        resolve(book); // search and return all books
    });

    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((book) => {
        res.status(200).json(book);
    }).catch(err => {
        res.status(404).json(err);
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve, reject) => {
        const author = req.params.author;

        let out = [];
        for (let [key, book] of Object.entries(books)) {
            if (author === book.author) {
                out.push(book);
            }
        }

        if (out.length === 0) {
            reject({message: 'No books'}); // return DB error
        }

        resolve(out);
    });

    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((books) => {
        res.status(200).json(books);
    }).catch(err => {
        res.status(404).json(err);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve, reject) => {
        const title = req.params.title;

        let out = [];
        for (let [key, book] of Object.entries(books)) {
            if (title === book.title) {
                out.push(book);
            }
        }

        if (out.length === 0) {
            reject({message: 'No books'}); // return DB error
        }

        resolve(out);
    });

    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((books) => {
        res.status(200).json(books);
    }).catch(err => {
        res.status(404).json(err);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({});
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
