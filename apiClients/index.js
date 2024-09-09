const axios = require('axios');
const createError = require('http-errors');

/** ---- Handle All Third Party Requests ---- */

const apiClients = {
    googleBooks: {
        async getBookByIsbn(isbn) {
          const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
          const response = await axios.get(url);
          const bookData = response.data.items[0].volumeInfo;
          if(!bookData) throw createError.NotFound(`Book not found for the provided ISBN`)

          return bookData;
        }
    },
    openLibrary:{
      async getBookByIsbn(isbn) {
          const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;
          const response = await axios.get(url);
          const bookData = response.data[`ISBN:${isbn}`].details;
          if (!bookData) throw createError.NotFound(`Book not found for the provided ISBN`)
    
          const authors = bookData.authors ? bookData.authors.map(author => author.name).join(', ') : '';
          const publishers = bookData.publishers ? bookData.publishers.map(publisher => publisher.name).join(', ') : '';
         
          if (!bookData.title) throw createError.BadRequest('Book data is incomplete or not found');
          
          return {
            title: bookData.title,
            author: authors,
            publisher: publishers,
          };
      }
    }
}

module.exports = apiClients;