var express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const user = require('../models/user');
const bcrypt = require('bcrypt');
var router = express.Router();
const User = require('../models').User;

router.get('/', (req, res) => {
  User.findAll().then(
    (users) => {
      return res.status(200).json(users);
    },
    (error) => {
      return res.status(500).json(error);
    }
  );
});

router.post('/', async (req, res) => {
  let { username, email, password } = req.body;
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
    return res.status(409).json({ message: 'User with email exists' });
  }
  const newUser = new User({ username, email, password: encryptedPassword });
  await newUser.save().then(res.status(201).json({ msg: 'user added' }));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let userfound = await User.findOne({ where: { email } });
    if (userfound) {
      const passCorrect = bcrypt.compareSync(password, userfound.password);
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
        const token = jwt.sign(payload, 'book_app_key', {
          expiresIn: 1200,
        });
        return res.status(200).json({ jwt: token });
      }
    } else {
      return res.status(400).json({ error: 'no such email exists' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Error' + error });
  }
});

module.exports = router;
