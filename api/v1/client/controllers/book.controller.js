const BookService = require("../../../../services/book.service");

class BookController{
    // Only For Librarian Access 
    async addBook(req, res, next){
        try {
            const newBook = await BookService.addOneBook(req.body);

            res.status(200).json({ 
                success: true, 
                message: 'Book added successfully',
                data: newBook
            });
        } catch (error) {
            next(error)
        }
    }

    // Only For Librarian Access 
    async deleteBook(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) throw createError.BadRequest('Id is required to delete a book');

            const deletedBook = await BookService.deleteBookById(id);

            res.status(200).json({ 
                success: true, 
                message: 'Book deleted successfully',
                data: deletedBook
            });
        } catch (error) {
            next(error)
        }
    }

    async getLibraryBooks(req, res, next){
        try {
            const books = await BookService.getAllBooks();
            res.status(200).json({
                success: true,
                message: 'Books retrieved successfully',
                data: books
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = BookController;