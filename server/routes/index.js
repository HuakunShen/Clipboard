const express = require('express');
const router = express.Router();
const path = require('path');
router.get('/secret', (req, res) => {
  res.download('./public/welcome/secret.bat', 'secret.bat');
});

router.get('/happy-birthday-melody', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../', 'public', 'welcome', 'welcome.html')
  );
});


module.exports = router;
