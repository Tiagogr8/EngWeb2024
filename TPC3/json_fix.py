import json

with open('filmes.json', 'r') as f:
    data = f.readlines()

json_string = '[' + ','.join(data) + ']'


filmes = json.loads(json_string)

lista_filmes = []
lista_generos = []
lista_atores = []

for filme in filmes:
    filme_info = {
        '_id': filme['_id'], 
        'title': filme['title'],
        'year': filme['year'],
        'cast': filme['cast'],
        'genres': filme.get('genres', []) 
    }
    lista_filmes.append(filme_info)

    for genre in filme_info['genres']:
        genre_found = False
        for genre_item in lista_generos:
            if genre_item['nome'] == genre:
                genre_item['filmes'].append(filme['_id']['$oid'])
                genre_found = True
                break
        if not genre_found:
            lista_generos.append({'nome': genre, 'filmes': [filme['_id']['$oid']]})

    for actor in filme_info['cast']:
        actor_found = False
        for actor_item in lista_atores:
            if actor_item['nome'] == actor:
                actor_item['filmes'].append(filme['_id']['$oid'])
                actor_found = True
                break
        if not actor_found:
            lista_atores.append({'nome': actor, 'filmes': [filme['_id']['$oid']]})


dados_corrigidos = {
    'filmes': lista_filmes,
    'generos': lista_generos,
    'atores': lista_atores
}

with open('filmes_fixed.json', 'w') as f:
    json.dump(dados_corrigidos, f, indent=4)