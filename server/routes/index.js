const express = require('express');
const actions = require('../methods/actions')
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end('Hello World!!\n');
});

router.post('/addpet', actions.create)
router.post('/findpet', actions.read);

module.exports = router
