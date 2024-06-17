var express = require('express');
var router = express.Router();
var auth = require('../Auth/auth');
var Inquiricao = require('../controllers/inquiricao');

router.use(auth.verificaAcesso);

function verificaPermissao(req, res, next) {
    Inquiricao.findById(req.params.id || req.params.idInquiricao)
        .then(inquiricao => {
            if (req.user.level === 'admin' || inquiricao.Creator === req.user.username) {
                next();
            } else {
                res.status(403).jsonp({ error: "Acesso negado." });
            }
        })
        .catch(erro => res.status(500).jsonp({ error: erro }));
}

function convertStringToDate(dateStr) {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
}

router.get('/', function (req, res) {
    const { nome, localidade, dateInicial, dateFinal, sort, creator } = req.query;
    let query = {};
    if (nome) {
        query.Name = { $regex: nome, $options: 'i' };
    }
    if (localidade) {
        query.Localidade = { $regex: localidade, $options: 'i' };
    }
    if (dateInicial || dateFinal) {
        query.UnitDateInitial = {};
        if (dateInicial) query.UnitDateInitial.$gte = dateInicial;
        if (dateFinal) query.UnitDateInitial.$lte = dateFinal;
    }
    if (creator) {
        query.Creator = creator;
    }

    let sortOption = {};
    if (sort) {
        if (sort === 'nome-asc') sortOption.Name = 1;
        if (sort === 'nome-desc') sortOption.Name = -1;
        if (sort === 'date-asc') sortOption.UnitDateInitial = 1;
        if (sort === 'date-desc') sortOption.UnitDateInitial = -1;
    }

    Inquiricao.find(query, sortOption)
        .then(dados => {
            dados = dados.filter(inquiricao => {
                const unitDateInitial = convertStringToDate(inquiricao.UnitDateInitial);
                const unitDateFinal = convertStringToDate(inquiricao.UnitDateFinal);
                const filterDateInicial = dateInicial ? convertStringToDate(dateInicial) : null;
                const filterDateFinal = dateFinal ? convertStringToDate(dateFinal) : null;

                if (filterDateInicial && filterDateFinal) {
                    return unitDateInitial >= filterDateInicial && unitDateFinal <= filterDateFinal;
                } else if (filterDateInicial) {
                    return unitDateInitial >= filterDateInicial;
                } else if (filterDateFinal) {
                    return unitDateFinal <= filterDateFinal;
                } else {
                    return true;
                }
            });
            res.jsonp(dados);
        })
        .catch(erro => res.status(500).jsonp(erro));
});


router.get('/:id', function (req, res) {
    Inquiricao.findById(req.params.id)
        .then(data => res.jsonp(data))
        .catch(erro => res.status(500).jsonp(erro));
});

router.put('/:id', verificaPermissao, function (req, res) {
    Inquiricao.update(req.params.id, req.body)
        .then(data => res.jsonp("Atualizado com sucesso"))
        .catch(erro => res.status(500).jsonp({ error: erro }));
});

router.post('/', function (req, res) {
    console.log('Recebendo solicitação de adição de inquirição:', req.body);

    // Converte os IDs dos posts para ObjectId se necessário
    if (req.body.posts && Array.isArray(req.body.posts)) {
        req.body.posts = req.body.posts.map(post => {
            if (typeof post._id === 'object' && post._id['$oid']) {
                post._id = post._id['$oid'];
            }
            return post;
        });
    }

    Inquiricao.insert(req.body)
        .then(data => res.jsonp("Adicionado com sucesso"))
        .catch(erro => {
            console.error("Erro ao adicionar inquirição:", erro);
            res.status(500).jsonp({ error: erro });
        });
});

router.delete('/:idInquiricao', verificaPermissao, function (req, res) {
    Inquiricao.delete(req.params.idInquiricao)
        .then(data => res.jsonp("Eliminado com sucesso"))
        .catch(erro => res.status(500).jsonp({ error: erro }));
});



// listar sugestões pendentes
router.get('/:id/suggestions', function (req, res) {
    Inquiricao.listSuggestions(req.params.id)
        .then(suggestions => {
            const pendingSuggestions = suggestions.filter(suggestion => suggestion.status === 'pending');
            res.jsonp(pendingSuggestions);
        })
        .catch(erro => res.status(500).jsonp({ error: erro }));
});

router.get('/suggestion/:id', verificaPermissao, function (req, res) {
    Inquiricao.getSuggestion(req.params.id)
        .then(data => res.jsonp(data))
        .catch(erro => res.status(500).jsonp({ error: erro }));
});

// Aceitar ou rejeitar sugestões
router.put('/suggestion/:id/status', function (req, res) {
    const { status } = req.body;

    Inquiricao.getSuggestion(req.params.id)
        .then(suggestion => {
            if (status === 'accepted') {
                const updatedFields = {
                    Name: suggestion.Name,
                    UnitDateInitial: suggestion.UnitDateInitial,
                    UnitDateFinal: suggestion.UnitDateFinal,
                    UnitDateInitialCertainty: suggestion.UnitDateInitialCertainty,
                    UnitDateFinalCertainty: suggestion.UnitDateFinalCertainty,
                    Repository: suggestion.Repository,
                    ScopeContent: suggestion.ScopeContent,
                    Localidade : suggestion.Localidade,
                    PhysLoc: suggestion.PhysLoc,
                    PreviousLoc: suggestion.PreviousLoc,
                    PhysTech: suggestion.PhysTech,
                    RelatedMaterial: suggestion.RelatedMaterial,
                    LangMaterial: suggestion.LangMaterial,
                    Parentesco : suggestion.Parentesco
                };

                return Inquiricao.update(suggestion.inquiricaoId, updatedFields)
                    .then(() => Inquiricao.updateSuggestionStatus(req.params.id, 'accepted'));
            } else if (status === 'rejected') {
                return Inquiricao.updateSuggestionStatus(req.params.id, 'rejected');
            }
        })
        .then(() => res.jsonp("Status da sugestão atualizado com sucesso"))
        .catch(erro => {
            console.error("Erro ao atualizar status da sugestão:", erro);
            res.status(500).jsonp({ error: erro });
        });
});

router.post('/:id/suggest', function (req, res) {
    const suggestion = Object.assign(
        { inquiricaoId: req.params.id, suggestedBy: req.user.username },
        req.body
    );

    Inquiricao.insertSuggestion(suggestion)
        .then(data => res.jsonp("Sugestão enviada com sucesso"))
        .catch(erro => res.status(500).jsonp({ error: erro }));
});

router.post('/:idInquiricao/posts', function (req, res) {
    const newPost = {
        idInquiricao: req.params.idInquiricao,
        username: req.user.username,
        descricao: req.body.descricao
    };

    Inquiricao.addPost(req.params.idInquiricao, newPost)
        .then(() => res.jsonp("Post adicionado com sucesso"))
        .catch(erro => res.status(500).jsonp({ error: erro }));
});

router.post('/posts/:postId/comments', function (req, res) {
    const newComment = {
        postId: req.params.postId,
        username: req.user.username,
        comentario: req.body.comentario
    };

    Inquiricao.addComment(req.params.postId, newComment)
        .then(() => res.jsonp("Comentário adicionado com sucesso"))
        .catch(erro => res.status(500).jsonp({ error: erro }));
});

router.get('/posts/:postId/comments', function (req, res) {
    Inquiricao.listComments(req.params.postId)
        .then(comments => res.jsonp(comments))
        .catch(erro => res.status(500).jsonp({ error: erro }));
});



module.exports = router;

