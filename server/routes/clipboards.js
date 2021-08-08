const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ShareClipboard = require('../models/ShareClipboard');
const User = require('../models/User');
const time = require('../util/time');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/:id', (req, res) => {
  ShareClipboard.findById(req.params.id)
    .then((doc) => {
      const dict = {};
      doc.clipboards_id.forEach((id) => (dict[id] = 1));
      User.findById(doc.user).then((user) => {
        const clipboards = [];
        user.clipboards.forEach((cb) => {
          if (dict[cb._id]) {
            clipboards.push(cb);
          }
        });
        res.send(clipboards);
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post('/', isAuthenticated, async (req, res) => {
  let { clipboards_id } = req.body;
  clipboards_id = clipboards_id.filter((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );
  try {
    const shareClipboard = new ShareClipboard({
      clipboards_id: clipboards_id,
      user: req.user,
    });
    // shareClipboard.clipboards = shareClipboard.clipboards.concat([clipboards]);
    const doc = await shareClipboard.save();
    setTimeout(function () {
      ShareClipboard.findByIdAndDelete(doc._id)
        .then((doc) => {})
        .catch((err) => {
          console.error(err);
        });
    }, time.one_minute * 10);
    res.send(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
