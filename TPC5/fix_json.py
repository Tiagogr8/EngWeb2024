import json

compositores = []
periodos = set()  

with open('compositores.json', 'r') as file:
    dados = json.load(file)

    for item in dados["compositores"]:
        if "modalidade" not in item:
            compositor = {
                "id": item["id"],
                "nome": item["nome"],
                "bio": item["bio"],
                "dataNasc": item["dataNasc"],
                "dataObito": item["dataObito"],
                "periodo": item["periodo"]
            }
            compositores.append(compositor)
            periodos.add(item["periodo"])  

periodos = [{"id": i + 1, "nome": periodo} for i, periodo in enumerate(periodos)]

new_json = {"compositores": compositores, "periodos": periodos}

with open('compositores_fixed.json', 'w') as f:
    json.dump(new_json, f, indent=4)
