const Book = require('../models/books');
const Categories = require('../models/categories');

const addBooks = async (req, res) => {
  console.log(req.body);
  const {
    name,
    isbn_no,
    author,
    edition,
    publication,
    price,
    availability,
    categoryId,
  } = req.body;

  try {
    const category = await Categories.findOne({where: {categoryId}});
    const book = await Book.create({
      name,
      isbn_no,
      author,
      edition,
      publication,
      price,
      availability,
      categoryId: category.id,
    });
    console.log(book);
    return res.status(201).json(book);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    return res.json(books);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

module.exports = {addBooks, getBooks};
