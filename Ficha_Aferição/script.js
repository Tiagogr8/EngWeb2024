var fs = require('fs');
var axios = require('axios');

fs.readFile('datasets/dataset-extra1.json', 'utf8', (erro, dados) => {
    var pessoas = JSON.parse(dados);
    pessoas.forEach(pessoa => {
        axios.post('http://localhost:3000/pessoas', pessoa);
    });
});

fs.readFile('datasets/dataset-extra2.json', 'utf8', (erro, dados) => {
    var pessoas = JSON.parse(dados);
    pessoas.forEach(pessoa => {
        axios.post('http://localhost:3000/pessoas', pessoa);
    });
});


fs.readFile('datasets/dataset-extra3.json', 'utf8', (erro, dados) => {
    var pessoas = JSON.parse(dados);
    pessoas.forEach(pessoa => {
        axios.post('http://localhost:3000/pessoas', pessoa);
    });
});