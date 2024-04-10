var express = require('express');
var router = express.Router()
var Pessoa = require("../controllers/pessoa");



router.get('/', function(req, res, next) {
  Pessoa.list()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
}
);


router.get('/:id', function(req, res, next) {
  Pessoa.findById(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});


router.post('/', function(req, res, next) {
  Pessoa.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});


router.put('/:id', function(req, res, next) {
  Pessoa.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});


router.delete('/:id', function(req, res, next) {
  return Pessoa.remove(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});



module.exports = router;
