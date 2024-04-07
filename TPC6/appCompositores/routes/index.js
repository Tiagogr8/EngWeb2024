var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.render("paginaInicial",{'date': d})
 
});

module.exports = router;
