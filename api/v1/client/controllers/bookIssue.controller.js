const BookIssueService = require("../../../../services/bookIssue.service");

class BookIssueController {
    /**
     * @route POST /book/issue
     * @description Issue a book to a user (only for Librarian access).
     * @body {Object} bookIssueDetails - The details required to issue the book.
     * @access Private (Librarian)
     */
    async issueBook(req, res, next) {
        try {
            const { user } = req;
            const issuedBook = await BookIssueService.issueBook(user.id, req.body);

            res.status(200).json({
                success: true,
                message: 'Book issued successfully',
                data: issuedBook
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @route GET /book/issued
     * @description Retrieve all books issued to the logged-in user (Staff & Student access).
     * @access Private (Staff or Student)
     */
    async getLoggedInUserIssuedBooks(req, res, next) {
        try {
            const { user } = req;
            const issuedBooks = await BookIssueService.getIssuedBooksByUserId(user.id);

            res.status(200).json({
                success: true,
                data: issuedBooks
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @route POST /book/transfer
     * @description Transfer an issued book to another user (Librarian or Staff access).
     * @body {Object} transferDetails - Details required for transferring the book.
     * @access Private (Librarian or Staff)
     */
    async transferBookToUser(req, res, next) {
        try {
            const { user } = req;
            const transferBook = await BookIssueService.transferBook(user.id, req.body);

            res.status(200).json({
                success: true,
                data: transferBook
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @route GET /book/issued/:bookId
     * @description Get the issued book record by book ID (Librarian access).
     * @param {string} bookId - The ID of the book to retrieve the issued record for.
     * @access Private (Librarian)
     */
    async getIssuedBookRecordByBookId(req, res, next) {
        try {
            const { bookId } = req.params;
            const issuedBooks = await BookIssueService.getRecordByBookId(bookId);

            res.status(200).json({
                success: true,
                data: issuedBooks
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BookIssueController;
