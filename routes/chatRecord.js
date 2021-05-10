var express = require('express');
var db = require('../socket.io/db');
var router = express.Router();

/* GET users listing. */
router.get('/chatRecords', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/chatRecords', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  let params = req.body;
  let roomNo = params.roomNo;
db.findChatRecords({room: roomNo}, function(result){
   res.send(result);
  console.log(result);
});

  // res.send('respond with a resource');
});

module.exports = router;

