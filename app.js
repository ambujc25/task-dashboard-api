var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');

require('./auth/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var managerRouter = require('./routes/manager');
var taskRouter = require('./routes/task');
var workerRouter = require('./routes/worker');
var secureManagerRouter = require('./routes/manager_loggedIn');
var secureWorkerRouter = require('./routes/worker_loggedIn');

var Manager = require('./models/Manager');

var app = express();

var mongoose = require('mongoose');
//var mongoDB = 'mongodb+srv://jil25:moserbaer@cluster0.4cipe.mongodb.net/netmeds_assignment?retryWrites=true&w=majority';
var mongoDB = 'mongodb+srv://jil25:moserbaer@cluster0.4cipe.mongodb.net/netmeds_2?retryWrites=true&w=majority'

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/manager', managerRouter);
app.use('/manager/logged', passport.authenticate('jwt', {session: false}), secureManagerRouter);
app.use('/task', taskRouter);
app.use('/worker', workerRouter);
app.use('/worker/logged', passport.authenticate('jwt', {session: false}), secureWorkerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
