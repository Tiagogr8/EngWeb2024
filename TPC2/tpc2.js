var http = require('http')
var url  = require('url')
var axios  = require('axios')


http.createServer((req,res) => {
    console.log(req.method + " " +req.url );

    var q  = url.parse(req.url,true)

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    
    if(req.url == "/"){
        res.write("<h1><a href= '/alunos'>Alunos</a></h1>")
        res.write("<h1><a href= '/cursos'>Cursos</a></h1>")
        res.write("<h1><a href= '/instrumentos'>Instrumentos</a></h1>")
        res.end()
    } else if(req.url == "/alunos"){
        axios.get("http://localhost:3000/alunos?_sort=nome")
            .then((resp) => {
                var data  = resp.data
                res.write("<div><h1>Alunos: </h1></div>")
                res.write("<ul>")
                for(i in data){
                    res.write("<li><a href='/alunos/" + data[i].id + "'>" +data[i].nome +  "</a></li>")
                }
                res.write("</ul>")
                res.write("<h3><a href= '/'>Voltar ao Menu Principal</a></h3>")
                res.end()

            })
            .catch((erro) =>{
                console.log("Erro: " + erro);
                res.write("<p> + erro + </p>")
            })
    } else if(req.url == "/cursos") {
        axios.get("http://localhost:3000/cursos?_sort=nome")
            .then((resp) => {
                var data  = resp.data
                res.write("<div><h1>Cursos: </h1></div>")
                res.write("<ul>")
                for(i in data){
                    res.write("<li><a href='/cursos/" + data[i].id + "'>" +data[i].designacao +  "</a></li>")
                }
                res.write("</ul>")
                res.write("<h3><a href= '/'>Voltar ao Menu Principal</a></h3>")
                res.end()

            })
            .catch((erro) =>{
                console.log("Erro: " + erro);
                res.write("<p> + erro + </p>")
            })
    } else if(req.url == "/instrumentos") {
        axios.get("http://localhost:3000/instrumentos?_sort=nome")
            .then((resp) => {
                var data  = resp.data   
                res.write("<div><h1>Instrumentos: </h1></div>")
                res.write("<ul>")
                for(i in data){
                    res.write("<li><a href='/instrumentos/" + data[i].id + "'>" +data[i]["#text"] +  "</a></li>")
                }
                res.write("</ul>")
                res.write("<h3><a href= '/'>Voltar ao Menu Principal</a></h3>")
                res.end()

            })
            .catch((erro) =>{
                console.log("Erro: " + erro);
                res.write("<p> + erro + </p>")
            })
    } else if(req.url.match(/\/alunos\/A[A-Z]*\d+/)){
        let id = req.url.substring(8)
        axios.get("http://localhost:3000/alunos/" + id)
            .then((resp) => {
                var data  = resp.data
                res.write("<h1>ID: " + data.id + "</h1>")
                res.write("<p><b>Nome: </b>" + data.nome + "</p>")
                res.write("<p><b>Data nascimento: </b>" + data.dataNasc+ "</p>") 
                res.write("<p><b>Curso: </b><a href = '/cursos/" + data.curso + "'>"+ data.curso + "</a></p>") 
                res.write("<p><b>Ano Curso: </b>" + data.anoCurso + "</p>") 
                res.write("<p><b>Instrumento: </b>" + data.instrumento + "</p>") 
                res.write("<h3><a href= '/alunos'>Lista de Alunos</a></h3>")
                res.end()
            })
            .catch((erro) =>{
                console.log("Erro: " + erro);
                res.write("<p> + erro + </p>")
            })
    } else if(req.url.match(/\/cursos\/C./)){
        let id = req.url.substring(8)
        axios.get("http://localhost:3000/cursos/" + id)
            .then((resp) => {
                var data  = resp.data
                res.write("<h1>ID: " + data.id + "</h1>")
                res.write("<p><b>Designação: </b>" + data.designacao +"</p>")
                res.write("<p><b>Duração: </b>" + data.duracao +"</p>")
                res.write("<p><b>Instrumento: </b>" + "<a href= '/instrumentos/" + data.instrumento["id"] + "'>"  + data.instrumento['#text'] + "<b> ID-></b>"+ data.instrumento['id'] +"</a></p>");
                res.write("<h3><a href='/cursos'>Lista de Cursos</a></h3>");
                res.end()
                
            })
            .catch((erro) =>{
                console.log("Erro: " + erro);
                res.write("<p> + erro + </p>")
            })
    } else if(req.url.match(/\/instrumentos\/I\d+/)){
        console.log("aaa " + req.url.substring(14))
        let id = req.url.substring(14)
        axios.get("http://localhost:3000/instrumentos/" + id)
            .then((resp) => {
                var data  = resp.data
                res.write("<h1>ID: " + data.id + "</h1>")
                res.write("<p><b>Instrumento: </b>" + data["#text"] +"</p>")
                res.write("<h3><a href='/instrumentos'>Lista de Instrumentos</a></h3>")
                res.end()
                
            })
            .catch((erro) =>{
                console.log("Erro: " + erro);
                res.write("<p> + erro + </p>")
            })
    }
    else{
        res.write("Operacao nao suportada")
        res.end()
    }


}).listen(2003)

console.log("Servidor à escuta na porta 2003")