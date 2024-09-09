var express = require('express');
var router = express.Router();

const BookController = require('../../controllers/book.controller');
const BookIssueController = require('../../controllers/bookIssue.controller');


const bookController = new BookController();
const bookIssueController = new BookIssueController();


/** ---- Auth Middleware ---- */
const { isLibrarian, isLibrarianOrStaff, isStaffOrStudent } = require('../../../../../middlewares/auth');


/** -- Book Routes --*/

/** --- Get All books of library --- */
router.get('/', isLibrarian, bookController.getLibraryBooks);

/** -- Add One Book by ISBN -- */
router.post('/', isLibrarian, bookController.addBook);

/** -- Delete One Book by ISBN -- */
router.delete('/:id', isLibrarian, bookController.deleteBook);

/** -- Issue Book to Student or Staff (only Librarian Access)-- */
router.post('/issue', isLibrarianOrStaff, bookIssueController.issueBook);

/** --- Get All Issues books for logged in users (Only Staff and Student Access) --- */
router.get('/issued', isStaffOrStudent, bookIssueController.getLoggedInUserIssuedBooks);

/** -- get Issued Book Record by Book Id -- */
router.get('/issued/:bookId', isLibrarian, bookIssueController.getIssuedBookRecordByBookId)

/** --- Transfer Issued books to Staff or student (Only Librarian and Staff Access ) --- */
router.post('/transfer', isLibrarianOrStaff, bookIssueController.transferBookToUser);



module.exports = router;


