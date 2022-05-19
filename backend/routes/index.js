var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/uploads/:name', (req, res) => {
  const filePath = path.join(__dirname, '../', `/uploads/${req.params.name}`);
  res.sendFile(filePath);
});

var booksRouter = require('./book');
var userRouter = require('./user');
var categoryRouter = require('./categories');

router.use('/books', booksRouter);
router.use('/categories', categoryRouter);
router.use('/user', userRouter);

module.exports = router;
