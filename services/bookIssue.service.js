const createError = require('http-errors');
const Model = require('../models');
const UserService = require('./user.service');
const BookService = require('./book.service');

class BookIssueService {

    static async issueBook(issuedBy, body){
        try {
            console.log( issuedBy, body )
            const { bookId, userId } = body;

            const book = await BookService.getById(bookId);
            
            if (book.status === 'issued') throw createError.BadRequest('Book is already issued');

            const issuedToUser = await UserService.getById(userId);

            if(!['student', 'staff'].includes(issuedToUser.role)){
                throw createError.BadRequest('Book can only issue to student or staff');
            }

            const issue = await Model.BookIssue.create({
                book: book._id,
                issuedTo: issuedToUser._id,
                originalIssuedTo:issuedToUser._id,
                issuedBy: issuedBy,
                issueDate: new Date(),
                status: 'issued',
                transferHistory: []
            });

            book.status = 'issued';
            
            await Promise.all([book.save()]);

            // Populate the book and issuedTo fields
            const populatedIssue = await Model.BookIssue.populate(issue, [
                { path: 'book', select: 'isbn title author publisher' },
                { path: 'issuedTo', select: 'name email role' }
            ]);
      
            return populatedIssue;
        } catch (error) {
            throw error;
        }
    }

    static async getIssuedBooksbyUserId(userId){
        try {
            
            if(!userId) throw createError.BadRequest('Provide User Id');

            const issuedBooks = await Model.BookIssue.find({ issuedTo: userId })
                .populate([
                    { path: 'book', select: 'isbn title author publisher' },
                    { path: 'issuedTo', select: 'name email role' },
                    { path: 'issuedBy', select: 'name email role' }
                ]);
    
            return issuedBooks;
        } catch (error) {
            throw error;
        }
    }

    static async getRecordByBookId(bookId){
        try {
            
            if(!bookId) throw createError.BadRequest('Provide Book Id');

            const issuedBooks = await Model.BookIssue.find({ book: bookId})
                .populate([
                    { path: 'book', select: 'isbn title author publisher' },
                    { path: 'issuedTo', select: 'name email role' },
                    { path: 'issuedBy', select: 'name email role' }
                ]);
    
            return issuedBooks;
        } catch (error) {
            throw error;
        }
    }

    static async transferBook(transferredBy, body) {
        try {
            const { bookId, issueTo } = body;
    
            if (!bookId) throw createError.BadRequest('Book Id is required');
            if (!issueTo) throw createError.BadRequest('New User Id is required');
            if (!transferredBy) throw createError.BadRequest('Transferred By is required');
            if (transferredBy === issueTo) throw createError.BadRequest('You cannot transfer a book to yourself');
    
            const bookIssue = await Model.BookIssue.findOne({ book: bookId, status:{ $in: ['issued', 'transferred'] } });
            if (!bookIssue) throw createError.NotFound('Book is not been issued');
            console.log( bookIssue, transferredBy)
            if (bookIssue.issuedTo.toString() !== transferredBy.toString()) {
                throw createError.BadRequest('Book is not been issued to you');
            }
            const lastTransfer = bookIssue.transferHistory[bookIssue.transferHistory.length - 1];
            if (lastTransfer && lastTransfer.transferredTo !== transferredBy) {
                throw createError.BadRequest('Book is already transferred to someone else');
            }
    
            const transferredByUser = await UserService.getById(transferredBy);
            if (!transferredByUser) throw createError.NotFound('Transferred By user not found');
    
            if (transferredByUser.role === 'student') {
                throw createError.BadRequest('Students are not allowed to transfer books');
            }
    
            const newUser = await UserService.getById(issueTo);
            if (!newUser) throw createError.NotFound('New user not found');
    
            if (!['student', 'staff'].includes(newUser.role)) {
                throw createError.BadRequest('Book can only be transferred to student or staff');
            }
    
            bookIssue.issuedTo = issueTo;
            bookIssue.status = 'transferred';
            bookIssue.transferHistory.push({
                transferredTo: issueTo,
                transferredBy: transferredBy,
                transferDate: new Date()
            });
            await bookIssue.save();
    
            // Populate the book, issuedTo, and issuedBy fields
            const populatedBookIssue = await Model.BookIssue.populate(bookIssue, [

                { path: 'book', select: 'isbn title author publisher' },
                { path: 'originalIssuedTo', select: 'name email role'},
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
            throw error;
        }
    }
}

module.exports = BookIssueService;