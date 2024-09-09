// Importing necessary modules
const createError = require('http-errors'); // Module to handle HTTP errors
const Model = require('../models');         // Importing the Book model from the models folder
const apiClients = require('../apiClients'); // Importing external API clients for fetching book details

// BookService class contains static methods to manage books (CRUD operations)
class BookService {

    // Method to add a book by its ISBN, fetching details from an external API
    static async addBookByIsbn(body) {
        try {
            // Destructuring the ISBN from the request body
            const { isbn } = body;

            // Throwing a Bad Request error if ISBN is missing
            if (!isbn) throw createError.BadRequest('ISBN is required to add a book');
            
            // Fetching book data using an external API based on the ISBN
            // Uncomment to use Google Books API if needed
            // const book = await apiClients.googleBooks.getBookByIsbn(isbn);
            const book = await apiClients.openLibrary.getBookByIsbn(isbn); // Example using OpenLibrary

            // Creating a payload with relevant book information
            const payload = {
                isbn: isbn,
                title: book.title,
                author: book.author,
                publisher: book.publisher
            };

            // Adding the book to the database by calling addOneBook method
            const newBook = await BookService.addOneBook(payload);

            // Returning the newly created book
            return newBook;

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to add a book directly into the database
    static async addOneBook(body) {
        try {
            // Destructuring the book details from the request body
            const { isbn, title, author, publisher } = body;

            // If ISBN is missing, throw a Bad Request error
            if (!isbn) throw createError.BadRequest('ISBN is required to add a book');

            // Creating a payload with the book details
            const payload = {
                isbn: isbn,
                title: title,
                author: author,
                publisher: publisher
            };

            // Adding the book to the database
            const newBook = await Model.Book.create(payload);

            // Returning the newly created book
            return newBook;

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to fetch a book by its ISBN
    static async getByIsbn(isbn) {
        try {
            // If ISBN is missing, throw a Bad Request error
            if (!isbn) throw createError.BadRequest('ISBN is required');

            // Fetching the book from the database using ISBN
            const book = await Model.Book.findOne({ isbn });
            if (!book) throw createError.NotFound('Book not found'); // If no book is found, throw a 404 error

            return book; // Return the found book

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to fetch a book by its ID
    static async getById(id) {
        try {
            // If ID is missing, throw a Bad Request error
            if (!id) throw createError.BadRequest('id is required');

            // Fetching the book from the database using its ID
            const book = await Model.Book.findById(id);
            if (!book) throw createError.NotFound('Book not found'); // If no book is found, throw a 404 error

            return book; // Return the found book

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to delete a book by its ISBN
    static async deleteBookByIsbn(isbn) {
        try {
            // If ISBN is missing, throw a Bad Request error
            if (!isbn) throw createError.BadRequest('ISBN is required to delete a book');

            // Deleting the book from the database using ISBN
            const book = await Model.Book.findOneAndDelete({ isbn });
            if (!book) throw createError.NotFound('Book not found'); // If no book is found, throw a 404 error

            return book; // Return the deleted book data

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to delete a book by its ID
    static async deleteBookById(id) {
        try {
            // If ID is missing, throw a Bad Request error
            if (!id) throw createError.BadRequest('Id is required to delete a book');

            // Deleting the book from the database using its ID
            const book = await Model.Book.findByIdAndDelete(id);
            if (!book) throw createError.NotFound('Book not found'); // If no book is found, throw a 404 error

            return book; // Return the deleted book data

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to fetch all books from the database
    static async getAllBooks() {
        try {
            // Fetching all books from the database
            const books = await Model.Book.find();

            // Return the list of all books
            return books;

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }
}

// Exporting the BookService class for use in other parts of the application
module.exports = BookService;
