const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models').Users;
const Books = require('../models').Books;
const Category = require('../models').Category;
const jwt = require('jsonwebtoken');
var cors = require('cors');

var authenticationmiddleware = require('../authentication/authenticationmiddleware');
const salt = bcrypt.genSaltSync(10);

router.get('/', (req, res) => {
  User.findAll().then(
    (users) => {
      res.json(users);
    },
    (error) => {
      res.json(error);
    }
  );
});

router.post('/', async (req, res) => {
  let { email, password } = req.body;
  let encryptedPassword;
  try {
    let salt = bcrypt.genSaltSync(10);
    encryptedPassword = bcrypt.hashSync(password, salt);
  } catch (error) {
    console.log(error);
  }
  const checkUser = await User.findOne({ where: { email } }).catch((err) => {
    console.log('Error', err);
  });
  if (checkUser) {
    return res.json({ message: 'User with email exists' });
  }
  const newUser = new User({ email, password: encryptedPassword });
  await newUser.save().then(res.json({ msg: 'user added' }));
});
router.get('/books', (req, res) => {
  Books.findAll().then(
    (books) => {
      res.json(books);
    },
    (error) => {
      res.json(error);
    }
  );
});

router.post('/category', (req, res) => {
  let { name } = req.body;
  Category.create({
    name: name,
  }).then(function () {
    res.json({ status: 1, data: 'Category created' });
  });
});

router.get('/category', (req, res) => {
  Category.findAll().then(
    (subjects) => {
      res.json(subjects);
    },
    (error) => {
      res.json(error);
    }
  );
});

router.post('/books', (req, res) => {
  console.log(req.body);
  let { title, author, subject, category_id, availability } = req.body;
  console.log(title, author, subject, category_id, availability);
  Books.create({
    title: title,
    author: author,
    subject: subject,
    category_id: category_id,
    availability: availability,
  }).then(function () {
    res.json({ status: 1, data: 'Book is added' });
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let anyUserWithSameMail = await User.findOne({ where: { email } });
    if (anyUserWithSameMail) {
      const passCorrect = bcrypt.compareSync(
        password,
        anyUserWithSameMail.password
      );
      if (!passCorrect) {
        return res.status(400).json({
          status: 0,
          debug_data: 'Wrong credentials - in comparesync',
        });
      } else {
        const payload = {
          user: {
            email,
          },
        };
        const token = jwt.sign(payload, 'employee_app_key', {
          expiresIn: 1200,
        });
        res.status(200).json({ jwt: token });
      }
    } else {
      return res.status(400).json({ error: 'no such email exists' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Error' + error });
  }
});

module.exports = router;
