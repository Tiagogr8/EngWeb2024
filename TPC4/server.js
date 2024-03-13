var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')        
var static = require('./static.js')           


function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var compositoresServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if (req.url == '/'){
                    res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                    res.write("<h1><a href='/compositores'>Compositores</a></h1>")
                    res.write("<h1><a href='/periodos'>Periodos</a></h1>")
                    res.end()
                }
                else if (req.url == '/compositores') {
                    axios.get("http://localhost:3000/compositores")
                        .then(resp => {
                            compositores = resp.data
                            res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.compositoresListPage(compositores,d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' })
                            res.write(templates.errorPage(erro, d))
                            res.end()
                        })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/compositores\/(C)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/compositores/" + id)
                        .then(resp =>{
                            compositor = resp.data
                            res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.compositorPage(compositor,d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(504,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.errorPage(erro, d))
                            res.end()
                        })
                }
                // GET /compositores/registo --------------------------------------------------------------------
                else if(req.url == '/compositores/registo'){
                    res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                    res.write(templates.compositorFormPage(d))
                    res.end()
                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.get("http://localhost:3000/compositores/" + id)
                        .then(resp =>{
                            compositor = resp.data
                            res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.compositorFormEditPage(compositor,d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(505,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.errorPage(erro, d))
                            res.end()
                        })
                }
                // GET /compositores/delete/:id ------------------------------------------------------------------
                else if(/\/compositores\/delete\/(C)[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.delete("http://localhost:3000/compositores/" + id)
                        .then(resp =>{
                            compositor = resp.data
                            res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write("<p>Registo apagado: " +id +"</p>")
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(510,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.errorPage(erro, d))
                            res.end()
                        })

                }
                
                // ***************************** PERIODOS ****************************************************
                else if (req.url == '/periodos') {
                    axios.get("http://localhost:3000/periodos")
                        .then(resp => {
                            periodos = resp.data
                            res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.periodosListPage(periodos,d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' })
                            res.write(templates.errorPage(erro, d))
                            res.end()
                        })
                }
                // GET /periodos/:id --------------------------------------------------------------------
                else if(/\/periodos\/[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/periodos/" + id)
                        .then(resp =>{
                            periodos = resp.data
                            res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.periodoPage(periodos,d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(504,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.errorPage(erro, d))
                            res.end()
                        })
                }
                // GET /periodos/registo --------------------------------------------------------------------
                else if(req.url == '/periodos/registo'){
                    res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                    res.write(templates.periodoFormPage(d))
                    res.end()
                }
                // GET /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.get("http://localhost:3000/periodos/" + id)
                        .then(resp =>{
                            periodo = resp.data
                            res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.periodoFormEditPage(periodo,d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(505,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.errorPage(erro, d))
                            res.end()
                        })
                }
                // GET /periodos/delete/:id ------------------------------------------------------------------
                else if(/\/periodos\/delete\/[0-9]+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.delete("http://localhost:3000/periodos/" + id)
                        .then(resp =>{
                            periodo = resp.data
                            res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write("<p>Registo apagado: " +id +"</p>")
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(510,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write(templates.errorPage(erro, d))
                            res.end()
                        })
                }
                // GET ? -> Lancar um erro
                else{
                    res.writeHead(502,{'Content-Type': 'text/html; charset = utf-8'})
                    res.write("<p>GET request não suportado: " + req.url +"</p>")
                    res.end()
                }
                break
            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if(req.url == '/compositores/registo'){
                    collectRequestBodyData(req, result =>{
                        if(result){
                            axios.post("http://localhost:3000/compositores",result)
                            .then(resp =>{
                                res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                                res.write(templates.compositorPage(resp.data,d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507,{'Content-Type': 'text/html; charset = utf-8'})
                                res.write(templates.errorPage(erro, d))
                                res.end()
                            })
                        } else{
                            res.writeHead(501,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write("<p>Não foi possivel os dados do body</p>")
                            res.end()
                        }
                    })
                }  
                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result =>{
                        if(result){
                            axios.put("http://localhost:3000/compositores/" + result.id,result)
                            .then(resp =>{
                                res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                                res.write(templates.compositorPage(resp.data,d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507,{'Content-Type': 'text/html; charset = utf-8'})
                                res.write(templates.errorPage(erro, d))
                                res.end()
                            })
                        } else{
                            res.writeHead(501,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write("<p>Não foi possivel os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST /periodos/registo --------------------------------------------------------------------
                else if(req.url == '/periodos/registo'){
                    collectRequestBodyData(req, result =>{
                        if(result){
                            axios.post("http://localhost:3000/periodos",result)
                            .then(resp =>{
                                res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                                res.write(templates.periodoPage(resp.data,d))
                                res.write("<p>Registo inserido: " + JSON.stringify(resp.data) + "</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507,{'Content-Type': 'text/html; charset = utf-8'})
                                res.write(templates.errorPage(erro, d))
                                res.end()
                            })
                        } else{
                            res.writeHead(501,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write("<p>Não foi possivel os dados do body</p>")
                            res.end()
                        }
                    })
                }  
                // POST /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result =>{
                        if(result){
                            console.log("resultidddd", result.id)
                            axios.put("http://localhost:3000/periodos/" + result.id,result)
                            .then(resp =>{
                                res.writeHead(200,{'Content-Type': 'text/html; charset = utf-8'})
                                res.write(templates.periodoPage(resp.data,d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507,{'Content-Type': 'text/html; charset = utf-8'})
                                res.write(templates.errorPage(erro, d))
                                res.end()
                            })
                        } else{
                            res.writeHead(501,{'Content-Type': 'text/html; charset = utf-8'})
                            res.write("<p>Não foi possivel os dados do body</p>")
                            res.end()
                        }
                    })
                }

                // POST ? -> Lancar um erro
                else{
                    res.writeHead(501,{'Content-Type': 'text/html; charset = utf-8'})
                    res.write("<p>Post request não suportado: " + req.url +"</p>")
                    res.end()
                }
                break;
            default: 
                // Outros metodos nao sao suportados
                res.writeHead(500,{'Content-Type': 'text/html; charset = utf-8'})
                res.write("<p>Método não suportado: " + req.method + " </p>")
                res.end()
        }
    }
})

compositoresServer.listen(2024, ()=>{
    console.log("Servidor à escuta na porta 2024")
})


