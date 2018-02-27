var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/week/1');
});

router.get('/week/:num', userController.user_week_get)
router.post('/activity/user/save', jsonParser, function(req,res,next) {
  res.json({success:true});
})
module.exports = router;
