const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Book = require('../models').Books;
var cors = require('cors');
const Category = require('../models').Categories;
const authentication = require('../middlewares/AuthenticationMiddleware');
let uniqueName = null;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    console.log(file);
    uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage: storage,
  limits: { fieldNameSize: 1000, fileSize: 102400000 },
  fileFilter: (req, file, cb) => {
    console.log('File filter running..');
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png .jpg and .jpeg are allwed'));
    }
  },
});
router.post(
  '/add',
  authentication,
  upload.single('image'),
  async (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      res.status(500).json(errors);
    } else {
      const {
        name,
        author,
        publication,
        price,
        availability,
        image,
        categoryId,
      } = req.body;
      try {
        try {
          const category = await Category.findOne({
            where: { id: categoryId },
          });
          const book = await Book.create({
            name,
            author,
            publication,
            price,
            availability,
            image: `/uploads/${uniqueName}`,
            categoryId: category.id,
          });
          console.log(book);
          return res.status(201).json(book);
        } catch (err) {
          console.log(err);
          return res.status(404).json({ message: 'No category Id' });
          // status code 404 indicated category doesnt exist
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    }
  }
);

router.get('/', authentication, async (req, res) => {
  await Book.findAll().then(
    (books) => {
      res.status(200).json(books);
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});

router.get('/:id', authentication, async (req, res) => {
  try {
    const books = await Book.findOne({ where: { id: req.params.id } });
    res.json(books);
  } catch (err) {
    res.json({ error: err });
  }
});

router.delete('/del/:id', authentication, async (req, res) => {
  try {
    const book = await Book.findOne({ where: { id: req.params.id } });
    await book.destroy();
    return res.status(200).json({ message: 'Book deleted!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});
router.put(
  '/edit/:id',
  authentication,
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name length should be greater than 3'),
  body('author')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Author must be minimum 5 characters '),
  body('publication')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Publication must be minimum 4 characters '),
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation error' });
    } else {
      const { name, author, publication, price, availability, categoryId } =
        req.body;
      try {
        const book = await Book.findOne({
          where: { id: parseInt(req.params.id) },
        });
        const category = await Category.findOne({ where: { id: categoryId } });
        console.log(category);
        book.name = name;
        book.author = author;
        book.publication = publication;
        book.price = price;
        book.availability = availability;
        book.categoryId = category.id;
        await book.save();
        return res.status(200).json(book);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'No such category' });
      }
    }
  }
);
module.exports = router;
