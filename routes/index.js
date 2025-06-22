var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("打印端口：", process.env.PORT)
 res.json({ "message": 'hellExpress' });
});

module.exports = router;
