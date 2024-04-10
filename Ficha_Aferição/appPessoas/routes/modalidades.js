var express = require('express');
var router = express.Router()
var Pessoa = require("../controllers/pessoa");


router.get('/', function(req, res, next) {
  Pessoa.modalidades()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
}
);

router.get('/:modalidades', function(req, res, next) {
    Pessoa.listAtletasModalidades(req.params.modalidades)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
  }
  );

module.exports = router;
