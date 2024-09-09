const createError = require('http-errors');
const Model = require('../models');
const apiClients = require('../apiClients');

class BookService {
    static async addBookByIsbn(body){
        try {
            const { isbn } = body;

            if (!isbn) throw createError.BadRequest('ISBN is required to add a book');
            
            // const book = await apiClients.googleBooks.getBookByIsbn(isbn);
            const book = await apiClients.openLibrary.getBookByIsbn(isbn);
            
            const payload = {
                isbn:isbn,
                title: book.title,
                author:book.author,
                publisher: book.publisher
            }

            const newBook = await BookService.addOneBook(payload);

            return newBook
        } catch (error) {
            throw error
        }
    }

    static async addOneBook(body){
        try {
            const { isbn, title, author, publisher } = body;

            if (!isbn) throw createError.BadRequest('ISBN is required to add a book');

            // const book = await apiClients.googleBooks.getBookByIsbn(isbn);
            
            // if (!book.title || !book.author || !book.publisher) throw createError.BadRequest('Book data is incomplete');

            const payload = {
                isbn:isbn,
                title:title,
                author:author,
                publisher:publisher
            }

            const newBook = await Model.Book.create(payload);

            return newBook
        } catch (error) {
            throw error
        }
    }

    static async getByIsbn(isbn) {
        try {
            if (!isbn) throw createError.BadRequest('ISBN is required');

            const book = await Model.Book.findOne({ isbn });
            if (!book) throw createError.NotFound('Book not found');
            return book;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            if (!id) throw createError.BadRequest('id is required');

            const book = await Model.Book.findById(id);
            if (!book) throw createError.NotFound('Book not found');
            return book;
        } catch (error) {
            throw error;
        }
    }

    static async deleteBookByIsbn(isbn) {
        try {
            if (!isbn) throw createError.BadRequest('ISBN is required to delete a book');

            const book = await Model.Book.findOneAndDelete({ isbn });
            if (!book) throw createError.NotFound('Book not found');

            return book;
        } catch (error) {
            throw error;
        }
    }

    static async deleteBookById(id) {
        try {
            if (!id) throw createError.BadRequest('Id is required to delete a book');

            const book = await Model.Book.findByIdAndDelete(id);
            if (!book) throw createError.NotFound('Book not found');

            return book;
        } catch (error) {
            throw error;
        }
    }

    static async getAllBooks() {
        try {
            const books = await Model.Book.find();
            return books;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BookService;