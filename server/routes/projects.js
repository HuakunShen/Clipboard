const express = require('express');
const Project = require('../models/Project');
const router = express.Router();
const mongoose = require('mongoose');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/all', async (req, res) => {
  Project.find()
    .sort('-modified_at')
    .then((projects) => {
      res.send(projects);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get('/search', async (req, res) => {
  res.send(req.query);
});

// add a single project
router.post('/', isAuthenticated, async (req, res) => {
  let { title, links, tags, description, star } = req.body;
  // filter empty links
  links = links.filter((link) => link.title);
  const curr_date = new Date();
  if (!title || tags.length === 0 || !description) {
    return res.status(400).send('Input Invalid');
  }
  try {
    const project = await Project.create({
      title,
      links,
      tags,
      star,
      description,
      create_at: curr_date,
      modified_at: curr_date,
    });
    res.send(project);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// edit a project
router.patch('/', isAuthenticated, async (req, res) => {
  let { title, links, tags, description, _id, star } = req.body;
  links = links.filter((link) => link.title);
  const curr_date = new Date();
  if (!title || tags.length === 0 || !description || !_id) {
    return res.status(400).send('Input Invalid');
  }
  try {
    const project = await Project.findByIdAndUpdate(
      _id,
      { title, links, tags, description, modified_at: curr_date, star },
      { new: true }
    );
    res.send(project);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.delete('/', isAuthenticated, (req, res) => {
  if (!req.body.id) {
    return res.status(400).send('id cannot be null');
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
    return res.status(400).send('id not valid');
  }
  if (process.env.adminPWD !== req.body.pwd) {
    return res.status(401).send('You have no access');
  }
  Project.findByIdAndDelete(req.body.id)
    .then(() => {
      res.send('Successfully Deleted');
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send('Failed');
    });
});

router.post('/add-test-projects', async (req, res) => {
  const subjects = [
    'new-Angular',
    'new-jQuery',
    'new-Polymer',
    'new-React',
    'new-Vue',
    'new-Python',
    'new-SQL',
    'new-MongoDB',
    'new-Verilog',
    'new-React',
    'new-Javascript',
    'new-Java',
    'new-C',
    'new-C++',
    'new-C#',
  ];
  const curr_date = new Date();
  for (let i = 0; i < subjects.length; i++) {
    const tags = [];
    // generate draw
    for (let i = 0; i < 4; i++) {
      const randI = Math.floor(Math.random() * (subjects.length - 1));
      if (randI < 0 || randI >= subjects.length) console.log(randI);
      const tag = subjects[randI];
      if (!tag) console.log(randI);
      if (!tags.includes(tag)) tags.push(tag);
    }
    await Project.create({
      title: subjects[i],
      // title: tags[0],
      links: [
        { title: 'github', link: 'https://github.com/HuakunShen' },
        { title: 'website', link: 'https://huakunshen.com' },
      ],
      description: 'Some Placeholder for Short Description',
      create_at: curr_date,
      modified_at: curr_date,
      // tags: [subjects[i]],
      tags,
    });
  }
  res.send('done');
});

router.delete('/remove-all', async (req, res) => {
  await Project.remove({});
  res.send('done');
});

module.exports = router;
