const express = require('express');
const router = express.Router();
const Category = require('../models').Categories;
const authentication = require('../middlewares/AuthenticationMiddleware');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post('/', authentication, async (req, res) => {
  let { name, description } = req.body;
  Category.create({
    name: name,
    description: description,
  }).then(function () {
    res.json({ status: 200, data: 'Category created' });
  });
});
module.exports = router;
