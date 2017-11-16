var  express = require('express');

var  jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var  cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

var mongojs = require('mongojs');

// connecting to mongo lab (Database-as-a-Service for MongoDB)

var db = mongojs('mongodb://user:user@ds245755.mlab.com:45755/bookStore');

app.options('*', cors());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");

    res.header('Access-Control-Allow-Credentials', true);
    next();
});

/*  For getting all books by user_id */

   app.get('/api/books/:user_id', function(req, res) {

       db.book.find({'user_id': req.params.user_id}, function (err, books) {

           if (err) {
               console.log(err);
               return err;
           }

           else {
               try {

                   res.setHeader("Connection", "close");
                   res.json(books);
               }
               catch (err) {
                   console.log("exception occured in getting books");
                   res.json(books);
               }
           }

       });

   }

     /*  For adding book by ISBN*/

       app.post('/api/book/:ISBN', function(req, res) {

           var bookInfo = req.body;

           db.book.findOne({'ISBN': req.params.ISBN}, function (err, book) {

               if (book != null) {
                   response.statusCode = 404;
                   res.setHeader("Connection", "close");
                   res.json("Book with this ISBN number  Already Exists");
               }
               else {
                   db.book.save(bookInfo, function (err, result) {
                           if (err) {
                               res.send(err);
                           } else {
                               res.setHeader("Connection", "close");
                               res.json(result);
                           }
                       }
                   );

                   console.log("Here is Added Book");
                   res.statusCode = 200
               }

           });

       }

app.listen(3001);
console.log('Listening on localhost:3001')
