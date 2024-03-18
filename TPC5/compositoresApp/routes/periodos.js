var express = require('express');
var router = express.Router();
var axios = require('axios')


router.get('/', function(req, res, next) { 
    var d = new Date().toISOString().substring(0, 16)
    axios.get("http://localhost:3000/periodos?_sort=nome")
    .then(resp =>{
        periodos = resp.data
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
  axios.get("http://localhost:3000/periodos/" +id)
  .then(resp =>{
      periodo = resp.data
      res.status(200).render("periodoPage", {'periodo' : periodo, 'date' : d})
  })
  .catch(erro =>{
      res.status(503).render('error', {'error' : erro})
  })
});



router.get('/edit/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idPeriodo
  axios.get("http://localhost:3000/periodos/" +id)
  .then(resp =>{
      periodo = resp.data
      res.status(200).render("periodoFormEditPage", {'periodo' : periodo, 'date' : d})
  })
  .catch(erro =>{
      res.status(504).render('error', {'error' : erro})
  })
});


router.get('/delete/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idPeriodo
  axios.delete("http://localhost:3000/periodos/" +id)
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
  axios.post("http://localhost:3000/periodos", result)
  .then(resp => {
      res.redirect("/periodos")
  })
  .catch(erro => {
    res.status(502).render('error', {'error' : erro})
  })
});


router.post('/edit/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var periodo = req.body
  axios.put("http://localhost:3000/periodos/" + periodo.id, periodo)
  .then(resp =>{
      res.redirect("/periodos")
  })
  .catch(erro =>{
      res.status(505).render('error', {'error' : erro})
  })
});

module.exports = router;


