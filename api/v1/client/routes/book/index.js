var express = require('express');
var router = express.Router();

const BookController = require('../../controllers/book.controller');
const BookIssueController = require('../../controllers/bookIssue.controller');

// Instantiate controllers
const bookController = new BookController();
const bookIssueController = new BookIssueController();

// Import authentication middleware
const { isLibrarian, isLibrarianOrStaff, isStaffOrStudent } = require('../../../../../middlewares/auth');

/** 
 * --- Book Routes ---
 * These routes handle operations related to books and book issues.
 */

/**
 * @route GET /book
 * @description Get all books in the library.
 * @middleware isLibrarian - Requires librarian role to access this route.
 * @access Private
 */
router.get('/', isLibrarian, bookController.getLibraryBooks);

/**
 * @route POST /book
 * @description Add a new book by ISBN.
 * @middleware isLibrarian - Requires librarian role to access this route.
 * @access Private
 */
router.post('/', isLibrarian, bookController.addBook);

/**
 * @route DELETE /book/:id
 * @description Delete a book by its ID.
 * @param {string} id - The ID of the book to delete.
 * @middleware isLibrarian - Requires librarian role to access this route.
 * @access Private
 */
router.delete('/:id', isLibrarian, bookController.deleteBook);

/**
 * @route POST /book/issue
 * @description Issue a book to a student or staff member.
 * @middleware isLibrarianOrStaff - Requires librarian or staff role to access this route.
 * @access Private
 */
router.post('/issue', isLibrarianOrStaff, bookIssueController.issueBook);

/**
 * @route GET /book/issued
 * @description Get all issued books for the logged-in user.
 * @middleware isStaffOrStudent - Requires staff or student role to access this route.
 * @access Private
 */
router.get('/issued', isStaffOrStudent, bookIssueController.getLoggedInUserIssuedBooks);

/**
 * @route GET /book/issued/:bookId
 * @description Get the issued book record by its ID.
 * @param {string} bookId - The ID of the issued book.
 * @middleware isLibrarian - Requires librarian role to access this route.
 * @access Private
 */
router.get('/issued/:bookId', isLibrarian, bookIssueController.getIssuedBookRecordByBookId);

/**
 * @route POST /book/transfer
 * @description Transfer an issued book to a staff or student.
 * @middleware isLibrarianOrStaff - Requires librarian or staff role to access this route.
 * @access Private
 */
router.post('/transfer', isLibrarianOrStaff, bookIssueController.transferBookToUser);

module.exports = router;
