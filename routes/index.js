var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

router.post('/imageRoute', function (req, res, next) {
  // get random weather for a location
  let imageData = req.body;
  console.log(imageData);
  //Check if the request data is empty
  if (imageData == null) {
    res.setHeader('Content-Type', 'application/json');
    res.status(403).json({error: 403, reason: 'no image data provided'});
  } else {
    // send the data back
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(imageData));
  }
});



module.exports = router;
