// Import necessary modules
const createError = require('http-errors'); // Module to handle HTTP errors
const Model = require('../models');         // Importing the models (BookIssue, etc.)
const UserService = require('./user.service'); // Importing UserService for user operations
const BookService = require('./book.service'); // Importing BookService for book operations

class BookIssueService {

    // Method to issue a book to a user
    static async issueBook(issuedBy, body) {
        try {
            // Destructuring bookId and userId from the request body
            const { bookId, userId } = body;

            // Fetching the book details by ID
            const book = await BookService.getById(bookId);

            // If the book is already issued, throw a Bad Request error
            if (book.status === 'issued') throw createError.BadRequest('Book is already issued');

            // Fetching the user details by ID
            const issuedToUser = await UserService.getById(userId);

            // Validating if the user role is either student or staff
            if (!['student', 'staff'].includes(issuedToUser.role)) {
                throw createError.BadRequest('Book can only be issued to student or staff');
            }

            // Creating a new book issue record
            const issue = await Model.BookIssue.create({
                book: book._id,
                issuedTo: issuedToUser._id,
                originalIssuedTo: issuedToUser._id,
                issuedBy: issuedBy,
                issueDate: new Date(),
                status: 'issued',
                transferHistory: []
            });

            // Updating the book status to 'issued'
            book.status = 'issued';
            await book.save();

            // Populate the book and issuedTo fields in the issue record
            const populatedIssue = await Model.BookIssue.populate(issue, [
                { path: 'book', select: 'isbn title author publisher' },
                { path: 'issuedTo', select: 'name email role' }
            ]);

            return populatedIssue;

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to get all books issued to a specific user
    static async getIssuedBooksbyUserId(userId) {
        try {
            // If userId is not provided, throw a Bad Request error
            if (!userId) throw createError.BadRequest('Provide User Id');

            // Fetching all issued books for the user and populating related fields
            const issuedBooks = await Model.BookIssue.find({ issuedTo: userId })
                .populate([
                    { path: 'book', select: 'isbn title author publisher' },
                    { path: 'issuedTo', select: 'name email role' },
                    { path: 'issuedBy', select: 'name email role' }
                ]);

            return issuedBooks;

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to get issue records by bookId
    static async getRecordByBookId(bookId) {
        try {
            // If bookId is not provided, throw a Bad Request error
            if (!bookId) throw createError.BadRequest('Provide Book Id');

            // Fetching all issue records for the book and populating related fields
            const issuedBooks = await Model.BookIssue.find({ book: bookId })
                .populate([
                    { path: 'book', select: 'isbn title author publisher' },
                    { path: 'issuedTo', select: 'name email role' },
                    { path: 'issuedBy', select: 'name email role' }
                ]);

            return issuedBooks;

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to transfer a book from one user to another
    static async transferBook(transferredBy, body) {
        try {
            // Destructuring bookId and issueTo (new userId) from the request body
            const { bookId, issueTo } = body;

            // Validating required fields
            if (!bookId) throw createError.BadRequest('Book Id is required');
            if (!issueTo) throw createError.BadRequest('New User Id is required');
            if (!transferredBy) throw createError.BadRequest('Transferred By is required');
            if (transferredBy === issueTo) throw createError.BadRequest('You cannot transfer a book to yourself');

            // Fetching the book issue record based on bookId and status
            const bookIssue = await Model.BookIssue.findOne({ book: bookId, status: { $in: ['issued', 'transferred'] } });
            if (!bookIssue) throw createError.NotFound('Book has not been issued');

            // Validating if the book was issued to the current user
            if (bookIssue.issuedTo.toString() !== transferredBy.toString()) {
                throw createError.BadRequest('Book is not issued to you');
            }

            // Checking the transfer history to ensure the book is not already transferred to someone else
            const lastTransfer = bookIssue.transferHistory[bookIssue.transferHistory.length - 1];
            if (lastTransfer && lastTransfer.transferredTo !== transferredBy) {
                throw createError.BadRequest('Book is already transferred to someone else');
            }

            // Fetching and validating the user who is transferring the book
            const transferredByUser = await UserService.getById(transferredBy);
            if (!transferredByUser) throw createError.NotFound('Transferred By user not found');
            if (transferredByUser.role === 'student') {
                throw createError.BadRequest('Students are not allowed to transfer books');
            }

            // Fetching and validating the new user to whom the book will be transferred
            const newUser = await UserService.getById(issueTo);
            if (!newUser) throw createError.NotFound('New user not found');
            if (!['student', 'staff'].includes(newUser.role)) {
                throw createError.BadRequest('Book can only be transferred to student or staff');
            }

            // Updating the book issue record with new user details and transfer history
            bookIssue.issuedTo = issueTo;
            bookIssue.status = 'transferred';
            bookIssue.transferHistory.push({
                transferredTo: issueTo,
                transferredBy: transferredBy,
                transferDate: new Date()
            });
            await bookIssue.save();

            // Populate the book, issuedTo, issuedBy, and transferHistory fields
            const populatedBookIssue = await Model.BookIssue.populate(bookIssue, [
                { path: 'book', select: 'isbn title author publisher' },
                { path: 'originalIssuedTo', select: 'name email role' },
                { path: 'issuedTo', select: 'name email role' },
                { path: 'issuedBy', select: 'name email role' },
                {
                    path: 'transferHistory',
                    populate: [
                        { path: 'transferredTo', select: 'name email role' },
                        { path: 'transferredBy', select: 'name email role' }
                    ]
                }
            ]);

            return populatedBookIssue;

        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }
}

// Exporting the BookIssueService class for use in other parts of the application
module.exports = BookIssueService;
