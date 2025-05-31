const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/verifyToken');

router.get('/protected', authenticate.verifyToken, (req, res) => {
  res.json({ message: 'You have entered', user: req.user });
});

module.exports = router;