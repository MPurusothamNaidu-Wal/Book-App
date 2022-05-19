var createError = require('http-errors');
var express = require('express');
const cron = require('node-cron');

var cors = require('cors');
var path = require('path');

const Book = require('./models').Books;

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

cron.schedule('* 19 * * *', async () => {
  await Book.create({
    name: 'demo book at 7',
    author: 'author name added',
    publication: 'publication added',
    price: '800',
    availability: 1,
    image: '/uploads/1652936192228-gulliver.jpg',
    categoryId: 1,
  });
});

module.exports = app;
