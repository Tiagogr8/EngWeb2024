var express = require('express');
var router = express.Router();
var Compositor = require("../controllers/compositor")

router.get('/', function(req, res, next) { 
  var d = new Date().toISOString().substring(0, 16)
  Compositor.list()
  .then(compositores =>{
      res.status(200).render("compositoresListPage", {'lCompositores' : compositores, 'date' : d})
  })
  .catch(erro =>{
      res.status(501).render('error', {'error' : erro})
  })
});


router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.status(200).render("compositorFormPage", {'date' : d})
});


router.get('/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idCompositor
  Compositor.findById(id)
  .then(compositor =>{
      res.status(200).render("compositorPage", {'compositor' : compositor, 'date' : d})
  })
  .catch(erro =>{
      res.status(503).render('error', {'error' : erro})
  })
});


router.get('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idCompositor
  Compositor.findById(id)
  .then(compositor =>{
      res.status(200).render("compositorFormEditPage", {'compositor' : compositor, 'date' : d})
  })
  .catch(erro =>{
      res.status(504).render('error', {'error' : erro})
  })
});


router.get('/delete/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idCompositor
  Compositor.remove(id)
  .then(resp =>{
      res.redirect("/compositores")
  })
  .catch(erro =>{
      res.status(506).render('error', {'error' : erro})
  })
});


router.post('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  result = req.body
  Compositor.insert(result)
  .then(resp => {
      res.redirect("/compositores")
  })
  .catch(erro => {
    res.status(502).render('error', {'error' : erro})
  })
});


router.post('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  Compositor.update(req.params.idCompositor, req.body)
  .then(resp =>{
      res.redirect("/compositores")
  })
  .catch(erro =>{
      res.status(505).render('error', {'error' : erro})
  })
});

module.exports = router;


