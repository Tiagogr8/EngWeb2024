var express = require('express');
var router = express.Router();
var Periodo = require("../controllers/periodo");
const periodo = require('../models/periodo');

router.get('/', function(req, res, next) { 
    var d = new Date().toISOString().substring(0, 16)
    Periodo.list()
    .then(periodos =>{
        res.status(200).render("periodosListPage", {'lPeriodos' : periodos, 'date' : d})
    })
    .catch(erro =>{
        res.status(501).render('error', {'error' : erro})
    })
  });


router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.status(200).render("periodoFormPage", {'date' : d})
});
  

router.get('/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idPeriodo
  Periodo.findById(id)
  .then(periodo =>{
      res.status(200).render("periodoPage", {'periodo' : periodo, 'date' : d})
  })
  .catch(erro =>{
      res.status(503).render('error', {'error' : erro})
  })
});



router.get('/edit/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idPeriodo
  Periodo.findById(id)
  .then(periodo=>{
      res.status(200).render("periodoFormEditPage", {'periodo' : periodo, 'date' : d})
  })
  .catch(erro =>{
      res.status(504).render('error', {'error' : erro})
  })
});


router.get('/delete/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idPeriodo
  Periodo.remove(id)
  .then(resp =>{
      res.redirect("/periodos")
  })
  .catch(erro =>{
      res.status(506).render('error', {'error' : erro})
  })
});


router.post('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  result = req.body
  Periodo.insert(result)
  .then(resp => {
      res.redirect("/periodos")
  })
  .catch(erro => {
    res.status(502).render('error', {'error' : erro})
  })
});


router.post('/edit/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  Periodo.update(req.params.idPeriodo, req.body)
  .then(resp =>{
      res.redirect("/periodos")
  })
  .catch(erro =>{
      res.status(505).render('error', {'error' : erro})
  })
});

module.exports = router;


