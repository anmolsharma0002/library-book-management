# Library Book Management
Library Book Management: This project requires the implementation of three distinct roles: Librarian, Staff, and Student.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Prerequisites
 1. MongoDB URI: Ensure you have a MongoDB connection URI ready (local or cloud-based, e.g., MongoDB Atlas).
 2. Node.js: Ensure Node.js is installed on your system.

 ## Installation
1. Clone the repository:
```bash
 git clone https://github.com/anmolsharma0002/library-book-management.git
```

2. Install dependencies:
```bash
 npm install
 ```

## Environment Setup
Create a new file named `.env.development` in the root directory of the project as mentioned in sample env `.env.example` or follow below .
```bash
NODE_ENV='development'
PORT=4000
MONGO_URI='Your MongoDB URI'
JWT_TOKEN_SECRET_KEY='Your-Secret'
TOKEN_ISSUER='issuer.your-name'
```

## Usage
To run the project, use the following command:
```bash
npm run dev
```

# Technology
1. MongoDB
2. Node.js
3. Third Part API https://openlibrary.org

# API Documentation
Visit The Below Postman Collection

https://www.postman.com/anmolbackend/workspace/library-management/collection/27783005-904369a0-1955-4361-870c-4fdaf71501cb?action=share&creator=27783005

Or You can Import File from root
`/api-document/Library Management Application API's.postman_collection.json`

# Contributing
Contributions to the Library Book Management application are welcome. If you'd like to contribute, please fork the repository, make your changes, and submit a pull request.



 # ------------------ Thank You ----------------