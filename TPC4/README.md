# TPC4: Compositores de Música
## 2024-03-11

## Autor:
- A100827
- Tiago Granja Rodrigues

## Resumo
Criar uma aplicação para a gestão de uma base de dados de compositores musicais:
1. Montar a API de dados com o json-server a partir do dataset de compositores em anexo;
2. Criar uma aplicação Web com as seguintes caraterísticas:
    1. CRUD sobre compositores;
    2. CRUD sobre periodos musicais.
3. Investigar e inserir pelo menos 5 compositores do período moderno ou serialista.

## Rotas importantes
- /compositores
- /compositores/{id}
- /compositores?periodo = {periodo}
- /periodos
- /periodos/{id}
```bash
$ json-server --watch compositores_fixed.json

$ node server.js
```