var express = require('express');
var router = express.Router();
var axios = require('axios');
var cookieParser = require('cookie-parser');

//const api_url = "http://localhost:7777";
const api_url = "http://api:7777";

router.use(cookieParser());

router.get('/', function (req, res, next) {
  const token = req.cookies.token;
  if (token) {
    res.redirect('/inquiricoes');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login', error: req.query.error });
});

router.get('/register', function (req, res, next) {
  res.render('signUp');
});

router.post('/login', function (req, res, next) {
  axios.post(`${api_url}/users/login`, req.body)
    .then(response => {
      if (response.data.token) {
        res.cookie('token', response.data.token, { httpOnly: true });
        res.redirect('/inquiricoes');
      } else {
        res.render('login', { title: 'Login', error: 'Credenciais Inválidas' });
      }
    })
    .catch(error => {
      console.error(error);
      res.render('login', { title: 'Login', error: 'Credenciais Inválidas.' });
    });
});

router.post('/register', function (req, res, next) {
  req.body.level = "user"
  axios.post(`${api_url}/users/register`, req.body)
    .then(response => {
      if (response.data.token) {
        res.cookie('token', response.data.token, { httpOnly: true });
        res.redirect('/login');
      } else {
        res.render('signUp', { error: 'Registration failed. Please try again.' });
      }
    })
    .catch(error => {
      console.error(error);
      res.render('signUp', { error: error.response.data.error || 'Registration failed. Please try again.' });
    });
});

router.get('/logout', function (req, res) {
  res.clearCookie('token');
  res.redirect('/login');
});

router.get('/profile', function (req, res) {
  const token = req.cookies.token;
  if (token) {
    axios.get(`${api_url}/users/profile`, { params: { token: token } })
      .then(response => {
        res.render('profile', { user: response.data });
      })
      .catch(error => {
        console.error(error);
        res.render('profile', { error: 'Failed to load user data.' });
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/profile/edit', function (req, res) {
  const token = req.cookies.token;
  if (token) {
    axios.get(`${api_url}/users/profile`, { params: { token: token } })
      .then(response => {
        res.render('editProfile', { user: response.data });
      })
      .catch(error => {
        console.error(error);
        res.render('editProfile', { error: 'Failed to load user data.' });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/profile/edit', function (req, res) {
  const token = req.cookies.token;
  if (token) {
    axios.put(`${api_url}/users/profile`, req.body, { params: { token: token } })
      .then(response => {
        res.redirect('/profile');
      })
      .catch(error => {
        console.error(error);
        res.render('editProfile', { error: 'Failed to update user data.' });
      });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
