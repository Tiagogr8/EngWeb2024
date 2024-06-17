const express = require('express');
const router = express.Router();
const axios = require('axios');
const PDFDocument = require('pdfkit');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const upload = multer({ dest: './Interface/uploads/' });
const imp = require('../middleware/import');
const exp = require('../middleware/export');
const Validator = require('../middleware/manifest_validator');

//const api_url = "http://localhost:7777";
const api_url = "http://api:7777";

router.use(cookieParser());

router.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    req.token = token;
    next();
  } else {
    res.redirect('/login');
  }
});

function formatDateForAPI(date) {
  if (!date) return '';
  const parts = date.split('-');
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatDateForInput(date) {
  if (!date) return '';
  const parts = date.split('-');
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function handleAuthError(error, res) {
  if (error.response && error.response.status === 401) {
    res.clearCookie('token');
    res.redirect('/login');
  } else {
    console.error(error);
    res.status(500).render('error', { error: 'Erro de servidor. Por favor, tente novamente mais tarde.' });
  }
}

router.get('/', function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const nome = req.query.nome || '';
  const localidade = req.query.localidade || '';
  const limit = req.query.limit === 'Tudo' ? Infinity : (parseInt(req.query.limit) || 10);
  const dateInicial = req.query.dateInicial && req.query.dateInicial !== 'undefined' ? formatDateForAPI(req.query.dateInicial) : '';
  const dateFinal = req.query.dateFinal && req.query.dateFinal !== 'undefined' ? formatDateForAPI(req.query.dateFinal) : '';
  const sort = req.query.sort || '';
  const token = req.token;

  let url = `${api_url}/inquiricoes?token=${token}&page=${page}&limit=${limit}`;
  let query = [];

  if (nome) query.push(`nome=${nome}`);
  if (localidade) query.push(`localidade=${localidade}`);
  if (dateInicial) query.push(`dateInicial=${dateInicial}`);
  if (dateFinal) query.push(`dateFinal=${dateFinal}`);
  if (sort) query.push(`sort=${sort}`);

  if (query.length > 0) {
    url += '&' + query.join('&');
  }

  axios.get(url)
    .then(resp => {
      const inquiricoes = resp.data;
      const user = jwt.decode(token);

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const currentInquiricoes = limit === Infinity ? inquiricoes : inquiricoes.slice(startIndex, endIndex);

      const totalPages = limit === Infinity ? 1 : Math.ceil(inquiricoes.length / limit);
      var d = new Date().toISOString().substring(0, 16);

      res.render("inquiricoesListPage", {
        lInquiricoes: currentInquiricoes,
        date: d,
        current: page,
        pages: totalPages,
        nome: nome,
        localidade: localidade,
        limit: limit === Infinity ? 'Tudo' : limit,
        dateInicial: req.query.dateInicial,
        dateFinal: req.query.dateFinal,
        sort: sort,
        user: user
      });
    })
    .catch(erro => handleAuthError(erro, res));
});

router.get('/myInquiricoes', function (req, res) {
  const user = jwt.decode(req.token);
  const page = parseInt(req.query.page) || 1;
  const nome = req.query.nome || '';
  const localidade = req.query.localidade || '';
  const limit = req.query.limit === 'Tudo' ? Infinity : (parseInt(req.query.limit) || 10);
  const dateInicial = req.query.dateInicial ? formatDateForAPI(req.query.dateInicial) : '';
  const dateFinal = req.query.dateFinal ? formatDateForAPI(req.query.dateFinal) : '';
  const sort = req.query.sort || '';
  const token = req.token;

  let url = `${api_url}/inquiricoes?creator=${user.username}&token=${token}`;
  let query = [];

  if (nome) query.push(`nome=${nome}`);
  if (localidade) query.push(`localidade=${localidade}`);
  if (dateInicial) query.push(`dateInicial=${dateInicial}`);
  if (dateFinal) query.push(`dateFinal=${dateFinal}`);
  if (sort) query.push(`sort=${sort}`);

  if (query.length > 0) {
    url += '&' + query.join('&');
  }

  axios.get(url)
    .then(resp => {
      const inquiricoes = resp.data;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const currentInquiricoes = limit === Infinity ? inquiricoes : inquiricoes.slice(startIndex, endIndex);

      const totalPages = limit === Infinity ? 1 : Math.ceil(inquiricoes.length / limit);
      var d = new Date().toISOString().substring(0, 16);

      res.render("myInquiricoes", {
        lInquiricoes: currentInquiricoes,
        date: d,
        current: page,
        pages: totalPages,
        nome: nome,
        localidade: localidade,
        limit: limit === Infinity ? 'Tudo' : limit,
        dateInicial: req.query.dateInicial,
        dateFinal: req.query.dateFinal,
        sort: sort,
        user: user
      });
    })
    .catch(erro => handleAuthError(erro, res));
});

router.get('/delete/:id', function (req, res) {
  const token = req.token;
  axios.get(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
    .then(resp => {
      const inquiricao = resp.data;
      const user = jwt.decode(token);

      if (user.level === 'admin' || user.username === inquiricao.Creator) {
        axios.delete(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
          .then(() => res.redirect('/inquiricoes'))
          .catch(erro => handleAuthError(erro, res));
      } else {
        res.redirect('/inquiricoes');
      }
    })
    .catch(erro => handleAuthError(erro, res));
});

router.post('/edit/:id', function (req, res) {
  const token = req.token;
  req.body.Parentesco = req.body.RelatedMaterial.split(',')
  axios.put(`${api_url}/inquiricoes/${req.params.id}`, req.body, { params: { token: token } })
    .then(() => {
      res.redirect(`/inquiricoes/${req.params.id}`);
    })
    .catch(erro => handleAuthError(erro, res));
});

router.get('/edit/:id', function (req, res) {
  const token = req.token;
  axios.get(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
    .then(resp => {
      const inquiricao = resp.data;
      const user = jwt.decode(token);

      if (user.level === 'admin' || user.username === inquiricao.Creator) {
        inquiricao.UnitDateInitial = formatDateForInput(inquiricao.UnitDateInitial);
        inquiricao.UnitDateFinal = formatDateForInput(inquiricao.UnitDateFinal);
        res.status(200).render('inquiricaoEditPage', { inquiricao: inquiricao });
      } else {
        res.redirect('/inquiricoes');
      }
    })
    .catch(erro => handleAuthError(erro, res));
});

router.post('/add', function (req, res) {
  const user = jwt.decode(req.token);
  var date = new Date().toISOString().substring(0, 19);
  req.body.Created = date;
  req.body.Creator = user.username;
  req.body.UnitDateInitial = formatDateForAPI(req.body.UnitDateInitial);
  req.body.UnitDateFinal = formatDateForAPI(req.body.UnitDateFinal);
  req.body.Parentesco = req.body.RelatedMaterial.split(',')
  axios.post(`${api_url}/inquiricoes/`, req.body, { params: { token: req.token } })
    .then(resp => {
      res.redirect('/inquiricoes/');
    })
    .catch(erro => handleAuthError(erro, res));
});

router.get('/add', function (req, res) {
  res.status(200).render('inquiricaoFormPage');
});

router.get('/database', function (req, res) {
  res.render('database');
});

router.post('/database/import', upload.single('backupFile'), function (req, res) {
  const path = req.file ? req.file.path : req.body.path;
  imp.importData(path, (error) => {
    if (error) {
      res.render('database', { errorMessage: `Erro na importação: ${error.message}` });
    } else {
      res.render('database', { successMessage: 'Importação feita com sucesso!' });
    }
  });
});

router.post('/database/export', function (req, res) {
  exp.exportData((error) => {
    if (error) {
      res.render('database', { errorMessage: `Erro na exportação: ${error.message}` });
    } else {
      res.render('database', { successMessage: 'Exportação feita com sucesso!' });
    }
  });
});

router.get('/upload', function (req, res) {
  res.status(200).render('uploadPage');
});

async function axiosPostWithRetry(url, data, options, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.post(url, data, options);
    } catch (error) {
      if (error.code === 'EAI_AGAIN' && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

router.post('/upload', upload.single('ficheiro'), async (req, res) => {
  const file = req.file;
  const tempExtractPath = path.join(__dirname, '../uploads', 'extracted');

  if (!fs.existsSync(tempExtractPath)) {
    fs.mkdirSync(tempExtractPath);
  }

  try {
    await fs.createReadStream(file.path)
      .pipe(unzipper.Extract({ path: tempExtractPath }))
      .promise();

    const extractedFiles = fs.readdirSync(tempExtractPath);
    const manifestPath = path.join(tempExtractPath, 'manifest.json');
    const manifestData = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestData);

    let errorOccurred = false;

    for (const extractedFile of extractedFiles) {
      if (extractedFile === "manifest.json") continue;
      const filePath = path.join(tempExtractPath, extractedFile);
      const stats = fs.statSync(filePath);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileData = {
        originalname: extractedFile,
        mimetype: Validator.getMimeType(extractedFile),
        size: stats.size
      };

      const obj = JSON.parse(fileContent);

      if (!Validator.validateManifest(fileData, manifest)) {
        errorOccurred = true;
        res.status(400).send(`Invalid file based on manifest: ${extractedFile}`);
        break;
      } else {
        try {
          await axiosPostWithRetry(`${api_url}/inquiricoes`, obj, { params: { token: req.token } });
        } catch (err) {
          errorOccurred = true;
          handleAuthError(err, res);
          break;
        }
      }
    }

    if (!errorOccurred) {
      fs.rmSync(file.path);
      fs.rmSync(tempExtractPath, { recursive: true });
      res.redirect('/inquiricoes'); // Use redirect instead of send
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no processamento do arquivo');
  }
});

router.get('/:id', function (req, res) {
  const token = req.token;
  axios.get(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
    .then(resp => {
      const inquiricao = resp.data;
      const user = jwt.decode(token);
      axios.get(`${api_url}/inquiricoes/${req.params.id}/suggestions?token=${token}`)
        .then(suggestionsResp => {
          const suggestions = suggestionsResp.data;
          const hasSuggestions = suggestions.length > 0;
          res.status(200).render("inquiricaoPage", {
            inquiricao: inquiricao,
            user: user || {},
            hasSuggestions: hasSuggestions
          });
        })
        .catch(err => handleAuthError(err, res));
    })
    .catch(erro => handleAuthError(erro, res));
});

router.get('/:id/pdf', function (req, res) {
  const token = req.token;
  axios.get(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
    .then(resp => {
      const inquiricao = resp.data;

      const doc = new PDFDocument();
      const fileName = `inquiricao_${inquiricao._id}.pdf`;

      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      res.setHeader('Content-type', 'application/pdf');

      doc.pipe(res);

      doc.fontSize(20).text("Inquirição de genere de " + inquiricao.Name, { align: 'center', underline: true });
      doc.moveDown();

      function addField(doc, fieldName, fieldValue) {
        if (fieldValue) {
          doc.font('Helvetica-Bold').fontSize(16).text(fieldName + ':', { continued: true });
          doc.font('Helvetica').fontSize(16).text(' ' + fieldValue);
          doc.moveDown();
        }
      }

      addField(doc, 'ID', inquiricao._id);
      addField(doc, 'Nome', inquiricao.Name);
      addField(doc, 'Datas de Produção', `${inquiricao.UnitDateInitial} a ${inquiricao.UnitDateFinal}`);
      addField(doc, 'Âmbito e conteúdo', inquiricao.ScopeContent);
      addField(doc, 'Localização atual', inquiricao.PhysLoc);
      addField(doc, 'Localização antiga', inquiricao.PreviousLoc);
      addField(doc, 'Características físicas e requisitos técnicos', inquiricao.PhysTech);
      addField(doc, 'Unidades de descrição relacionadas', inquiricao.RelatedMaterial);
      addField(doc, 'Línguas e escritas', inquiricao.LangMaterial);
      addField(doc, 'Fonte', inquiricao.Source);
      addField(doc, 'Repositório', inquiricao.Repository);
      addField(doc, 'Localidade', inquiricao.Localidade);
      addField(doc, 'Parentesco', inquiricao.Parentesco ? inquiricao.Parentesco.join(', ') : '');

      doc.end();
    })
    .catch(error => handleAuthError(error, res));
});

router.get('/:id/suggest', function (req, res) {
  const token = req.token;
  axios.get(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
    .then(resp => {
      const inquiricao = resp.data;
      const user = jwt.decode(token);
      inquiricao.UnitDateInitial = formatDateForInput(inquiricao.UnitDateInitial);
      inquiricao.UnitDateFinal = formatDateForInput(inquiricao.UnitDateFinal);
      res.status(200).render("inquiricaoSuggestPage", {
        inquiricao: inquiricao,
        user: user || {}
      });
    })
    .catch(erro => handleAuthError(erro, res));
});

router.get('/:id/suggest/confirm', function (req, res) {
  res.render('suggestionConfirmPage', { inquiricaoId: req.params.id });
});

router.post('/:id/suggest', function (req, res) {
  const token = req.token;
  const user = jwt.decode(token);
  const suggestion = {
    inquiricaoId: req.params.id,
    suggestedBy: user.username,
    Parentesco: req.body.RelatedMaterial.split(','),
    ...req.body,
  };

  axios.post(`${api_url}/inquiricoes/${req.params.id}/suggest`, suggestion, {
    params: { token: req.token }
  })
    .then(() => {
      res.redirect(`/inquiricoes/${req.params.id}/suggest/confirm`);
    })
    .catch(erro => handleAuthError(erro, res));
});

router.get('/:id/suggestions', function (req, res) {
  const token = req.token;
  axios.get(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
    .then(respInquiricao => {
      const inquiricao = respInquiricao.data;
      axios.get(`${api_url}/inquiricoes/${req.params.id}/suggestions?token=${token}`)
        .then(respSuggestions => {
          const suggestions = respSuggestions.data;
          inquiricao.UnitDateInitial = formatDateForInput(inquiricao.UnitDateInitial);
          inquiricao.UnitDateFinal = formatDateForInput(inquiricao.UnitDateFinal);
          res.status(200).render("suggestionsPage", {
            inquiricao: inquiricao,
            suggestions: suggestions,
            user: jwt.decode(token) || {}
          });
        })
        .catch(erro => handleAuthError(erro, res));
    })
    .catch(erro => handleAuthError(erro, res));
});

router.post('/suggestion/:id/status', function (req, res) {
  const token = req.token;
  const { status, inquiricaoId } = req.body;

  axios.put(`${api_url}/inquiricoes/suggestion/${req.params.id}/status`, { status }, {
    params: { token }
  })
    .then(() => {
      if (status === 'accepted') {
        axios.put(`${api_url}/inquiricoes/${inquiricaoId}`, req.body, { params: { token } })
          .then(() => res.redirect(`/inquiricoes/${inquiricaoId}`))
          .catch(erro => handleAuthError(erro, res));
      } else {
        res.redirect('back');
      }
    })
    .catch(erro => {
      console.error("Erro ao atualizar status da sugestão:", erro);
      handleAuthError(erro, res);
    });
});

router.get('/:id/addPost', function (req, res) {
  const token = req.token;
  axios.get(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
    .then(resp => {
      const inquiricao = resp.data;
      const user = jwt.decode(token);
      res.status(200).render("addPostPage", {
        inquiricao: inquiricao,
        user: user || {}
      });
    })
    .catch(erro => handleAuthError(erro, res));
});

router.post('/:id/addPost', (req, res) => {
  const token = req.token;
  const user = jwt.decode(token);
  const newPost = {
    idInquiricao: req.params.id,
    username: user.username,
    descricao: req.body.descricao
  };

  axios.post(`${api_url}/inquiricoes/${req.params.id}/posts`, newPost, { params: { token: token } })
    .then(() => res.redirect(`/inquiricoes/${req.params.id}`))
    .catch(erro => handleAuthError(erro, res));
});

router.get('/:id/posts', function (req, res) {
  const token = req.token;
  axios.get(`${api_url}/inquiricoes/${req.params.id}?token=${token}`)
    .then(resp => {
      const inquiricao = resp.data;
      const user = jwt.decode(token);
      res.status(200).render("inquiricaoPostsPage", {
        inquiricao: inquiricao,
        user: user || {},
        posts: inquiricao.posts
      });
    })
    .catch(erro => handleAuthError(erro, res));
});

router.get('/posts/:postId', function (req, res) {
  const token = req.token;

  axios.get(`${api_url}/inquiricoes/posts/${req.params.postId}/comments`, { params: { token: token } })
    .then(resp => {
      const comments = resp.data.comments;
      const post = resp.data.post;
      const user = jwt.decode(token);
      res.render("postCommentsPage", {
        post: post,
        comments: comments,
        user: user || {}
      });
    })
    .catch(erro => handleAuthError(erro, res));
});

router.post('/posts/:postId/comments', (req, res) => {
  const token = req.token;
  const user = jwt.decode(token);
  const newComment = {
    postId: req.params.postId,
    username: user.username,
    comentario: req.body.comentario
  };

  axios.post(`${api_url}/inquiricoes/posts/${req.params.postId}/comments`, newComment, { params: { token: token } })
    .then(() => res.redirect('back'))
    .catch(erro => handleAuthError(erro, res));
});

module.exports = router;
