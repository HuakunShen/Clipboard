const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const { isAuthenticated } = require('../middlewares/auth');
const s3Client = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/files', isAuthenticated, upload.array('files'), (req, res) => {
  const promise_array = [];
  req.files.forEach((file) => {
    const params = {
      Acl: 'public-read',
      Bucket: process.env.Bucket,
      Key:
        `${req.body.folder ? req.body.folder + '/' : ''}` + file.originalname,
      Body: file.buffer,
    };
    const putObjectPromise = s3Client.upload(params).promise();
    promise_array.push(putObjectPromise);
  });
  Promise.all(promise_array)
    .then((values) => {
      const urls = values.map((value) => value.Location);
      req.files.forEach(
        (file, index) => (values[index].filename = file.originalname)
      );
      res.send(values);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.delete('/files', isAuthenticated, (req, res) => {
  const keys = req.body.keys;
  const params = {
    Bucket: process.env.Bucket,
    Delete: {
      Objects: keys,
    },
    // Quiet: false,
  };
  s3Client.deleteObjects(params, function (err, data) {
    if (err) {
      console.error(err);
      res.status(500).send('fail to delete');
    }
    // an error occurred
    else {
      res.send('Deleted');
    }
  });
});

router.delete('/file', isAuthenticated, (req, res) => {
  const Key = req.body.Key;
  const params = {
    Bucket: process.env.Bucket,
    Key: Key,
  };
  s3Client.deleteObject(params, function (err, data) {
    if (err) {
      console.error(err, err.stack);
      res.status(500).send('fail to delete');
    } else {
      res.send('Deleted');
    }
  });
});

module.exports = router;
