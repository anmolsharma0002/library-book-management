const mongoose = require('mongoose');

const Model = {}

Model.mongoose = mongoose

Model.User = require('./user.model');
Model.Book = require('./book.model');
Model.BookIssue = require('./bookIssue.model');

module.exports = Model // export all models from one place