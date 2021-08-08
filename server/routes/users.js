const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// register
router.post('/', (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) return res.status(400).json({ message: 'User already exists' });
    User.create(req.body)
      .then((user) => {
        req.session.user = user._id;
        res.status(200).send('Registered ' + user.username);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
});

//login
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // User.findOne({username}).then()
  User.findByUsernamePassword(username, password)
    .then((user) => {
      if (!user) {
        console.warn('User not found');
        res.status(404).send('User not found');
      } else {
        req.session.user = user._id;
        res.status(200).send('Logged in as ' + user.username);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send(error);
    });
});

// logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('logout failed');
    }
    res.send('logged out');
  });
});

router.get('/test-session', isAuthenticated, (req, res) => {
  res.send(req.session);
});

router.get('/load_auth', isAuthenticated, (req, res) => {
  User.findById(req.session.user)
    .select('-password -__v')
    .then((user) => {
      if (!user) {
        console.error('something went wrong');
        return res.send('something went wrong');
      }
      return res.send(user);
    });
});

// get all clipboards
router.get('/clipboards', isAuthenticated, (req, res) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) return res.status(400).send('User not found');
      return res.send(user.clipboards);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// post a clipboard
router.patch('/clipboards', isAuthenticated, (req, res) => {
  let { clipboards } = req.body;
  clipboards = clipboards.filter(
    (clipboard) => clipboard.type && clipboard.content
  );
  User.findByIdAndUpdate(
    req.user,
    { $push: { clipboards: { $each: clipboards } } },
    { new: true }
  )
    .then((user) => {
      res.send(user.clipboards);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// add or change clipboard text
router.patch('/clipboard-text', isAuthenticated, async (req, res) => {
  const { text } = req.body;
  try {
    if (text._id) {
      // edit clipboard text
      const user = await User.findOneAndUpdate(
        { _id: req.user, 'clipboards._id': text._id },
        {
          $set: {
            'clipboards.$': text,
          },
        },
        { new: true }
      );
      res.send(user.clipboards);
    } else {
      // add clipboard text
      const user = await User.findByIdAndUpdate(
        req.user,
        { $push: { clipboards: text } },
        { new: true }
      );
      res.send(user.clipboards[user.clipboards.length - 1]); // send back the newly added clipboard
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete clipboard content
router.delete('/clipboards', isAuthenticated, async (req, res) => {
  try {
    // await User.updateMany({ _id: req.user, 'clipboards._id': req.body.[0] });
    await User.findByIdAndUpdate(req.user, {
      $pull: { clipboards: { _id: { $in: req.body } } },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// change password
router.patch('/change-pwd', isAuthenticated, (req, res) => {
  User.findById(req.user)
    .then(async (user) => {
      user.password = req.body.password;
      const new_user = await user.save();
      res.send(new_user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
