const BookIssueService = require("../../../../services/bookIssue.service");

class BookIssueController{
    // Only For Librarian Access 
    async issueBook(req, res, next){
        try {
            const { user } = req;
            const issuedBook = await BookIssueService.issueBook(user.id, req.body);

            res.status(200).json({ 
                success: true, 
                message: 'Book Issued successfully',
                data:issuedBook
            });
        } catch (error) {
            next(error)
        }
    }

   // View all books issued to the logged-in user (Staff & Student)
   async getLoggedInUserIssuedBooks(req, res, next){
        try {
            const { user } = req
            const issuedBooks = await BookIssueService.getIssuedBooksbyUserId(user.id);

            res.status(200).json({ 
                success: true, 
                data:issuedBooks
            });
        } catch (error) {
            next(error);
        }
   }

   // transfer book to student or staff 
   async transferBookToUser(req, res, next){
        try {
            const { user } = req
            const transferBook = await BookIssueService.transferBook(user.id, req.body);

            res.status(200).json({ 
                success: true, 
                data:transferBook
            });
        } catch (error) {
            next(error);
        }
   }

   // Get issued book record by book id (Librarian Access)
   async getIssuedBookRecordByBookId(req, res, next){
    try {
        const { bookId } = req.params
        const issuedBooks = await BookIssueService.getRecordByBookId(bookId);

        res.status(200).json({ 
            success: true, 
            data:issuedBooks
        });
    } catch (error) {
        next(error);
    }
}

}

module.exports = BookIssueController;