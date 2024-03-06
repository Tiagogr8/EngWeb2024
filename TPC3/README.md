# TPC3: Filmes Americanos
## 2024-03-03

## Autor:
- A100827
- Tiago Granja Rodrigues

## Resumo
Neste trabalho, utilizamos o ficheiro `filmes.json`, que teve de ser preparado antes de ser utilizado pelo `json-server`, o mesmo foi ainda dividido em filmes, géneros e atores.

O objetivo principal foi criar um website contendo informações sobre os filmes, incluindo detalhes sobre os géneros e os atores envolvidos. 

## Páginas
- `/`: Página inicial
- `/filmes`: Lista dos filmes
- `/filmes/id`: Página do filme 
- `/generos`: Lista dos géneros
- `/generos/idGen`: Página de cada género, com os filmes associados ao mesmo
- `/ator`: Lista dos atores
- `/ator/idAtor`: Página de cada ator, com os filmes do mesmo

```bash
$ json-server --watch filmes_fixed.json

$ node server.js
```