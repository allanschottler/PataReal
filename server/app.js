const express = require('express');
const session = require('express-session')
const createError = require('http-errors')
const cors = require('cors')
const logger = require('morgan');
const bodyParser = require('body-parser')
//const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db')
const passport = require('./config/passport')
const indexRouter = require('./routes/index')

const hostname = 'localhost';
const port = 3000;

connectDB(function(db) {
  var app = express();

  app.use(cors());
  app.use(logger('dev'));
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyParser.json('application/json'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({ secret: 'secret', cookie: { maxAge: 60000, secure: false }, resave: false, saveUninitialized: false }));
  // Init passport authentication 
  app.use(passport.initialize());
  // persistent login sessions 
  //app.use(passport.session());
  //app.use(cookieParser());

  app.use('/', indexRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    console.log(err.message);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.end('error');
  });

  app.listen(3000, console.log(`Server running on ${hostname}:${port}`))
});
