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
  console.log(req.body);
  console.log(req.files);

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
      console.log(values);
      const urls = values.map((value) => value.Location);
      console.log(urls);
      req.files.forEach(
        (file, index) => (values[index].filename = file.originalname)
      );
      res.send(values);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

router.delete('/files', isAuthenticated, (req, res) => {
  const keys = req.body.keys;
  console.log(keys);
  console.log(typeof keys);
  const params = {
    Bucket: process.env.Bucket,
    Delete: {
      Objects: keys,
    },
    // Quiet: false,
  };
  console.log(params);

  s3Client.deleteObjects(params, function (err, data) {
    if (err) {
      //   console.log(err, err.stack);
      console.log(err);

      res.status(500).send('fail to delete');
    }
    // an error occurred
    else {
      console.log(data); // successful response
      res.send('Deleted');
    }
  });
});

router.delete('/file', isAuthenticated, (req, res) => {
  const Key = req.body.Key;
  console.log(Key);
  const params = {
    Bucket: process.env.Bucket,
    Key: Key,
  };
  console.log(params);
  s3Client.deleteObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      res.status(500).send('fail to delete');
    } else {
      console.log(data);
      res.send('Deleted');
    }
  });
});

module.exports = router;
