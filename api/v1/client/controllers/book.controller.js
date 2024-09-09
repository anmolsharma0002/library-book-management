const BookService = require("../../../../services/book.service");
const createError = require('http-errors');

class BookController {
    /**
     * @route POST /book
     * @description Add a new book to the library (Librarian access).
     * @body {Object} bookDetails - Details of the book to be added.
     * @access Private (Librarian)
     */
    async addBook(req, res, next) {
        try {
            const newBook = await BookService.addOneBook(req.body);

            res.status(200).json({
                success: true,
                message: 'Book added successfully',
                data: newBook
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @route DELETE /book/:id
     * @description Delete a book from the library by its ID (Librarian access).
     * @param {string} id - The ID of the book to be deleted.
     * @access Private (Librarian)
     */
    async deleteBook(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) throw createError.BadRequest('ID is required to delete a book');

            const deletedBook = await BookService.deleteBookById(id);

            res.status(200).json({
                success: true,
                message: 'Book deleted successfully',
                data: deletedBook
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @route GET /book
     * @description Retrieve all books in the library.
     * @access Public
     */
    async getLibraryBooks(req, res, next) {
        try {
            const books = await BookService.getAllBooks();

            res.status(200).json({
                success: true,
                message: 'Books retrieved successfully',
                data: books
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BookController;
