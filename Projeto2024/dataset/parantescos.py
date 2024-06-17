import re
import json

data_file = "db.json"


# Função para extrair nomes do UnitTitle
def extract_names(unit_title):
    # Remove a parte inicial
    names_part = unit_title.replace("Inquirição de genere de ", "")
    # Substitui " e " por vírgula para poder usar o split
    names_part = names_part.replace(" e ", ", ")
    # Separa os nomes por vírgula e ponto e vírgula
    names = re.split(r'[;,]\s*', names_part)
    return [name.strip() for name in names]



# Função para extrair os pais do ScopeContent
def extract_parents(scope_content):
    match = re.search(r"Filiação: ([^\.]+)\.", scope_content)
    if match:
        parents_part = match.group(1).replace(" e ", ", ")
        parents = re.split(r'[;,]\s*', parents_part)
        return [parent.strip() for parent in parents]
    return []

def getIDByName(data, target_name):
    for entry in data:
        if entry.get("Name") == target_name:
            return entry.get("_id")
    return 0

# Função para extrair relações do RelatedMaterial
def extract_relations(related_material):
    if related_material.startswith("Série Inquirições de genere: "):
        relevant_part = related_material[len("Série Inquirições de genere: "):]
        relations = re.findall(r"([A-Za-záéíóúàèìòùâêîôûãõçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ\s]+),\s*([^\.\,]+)\.\s*Proc\.(\d+)", relevant_part)
        return relations
    return []

# Carregar dados do arquivo JSON
with open(data_file, 'r') as f:
    data = json.load(f)

# Dicionário para armazenar todas as pessoas e suas informações
people = {}

# Primeira passagem: coletar todas as pessoas e suas informações básicas
for entry in data:

    names = extract_names(entry.get("UnitTitle", ""))
    if names:
        entry["Name"] = names[0]  # Guarda apenas o primeiro nome
    else:
        entry["Name"] = ""  # Se não houver nomes, guarda uma string vazia
    
    # Remove o campo UnitTitle
    if "UnitTitle" in entry:
        del entry["UnitTitle"]
    
    names = extract_names(entry.get("UnitTitle", ""))
    for name in names:
        if name not in people:
            people[name] = {"names": names.copy(), "parents": [], "relations": {}}

# Segunda passagem: adicionar pais e relações
for entry in data:
    names = extract_names(entry.get("UnitTitle", ""))
    parents = extract_parents(entry.get("ScopeContent", ""))
    relations = extract_relations(entry.get("RelatedMaterial", ""))
    results = []
    for name in names:
        if name in people:
            people[name]["parents"] = parents
        
        for rel_name, relation, _ in relations:
            if (rel_name.strip(), relation.strip()) not in people[name]["relations"].get(rel_name, []):
                people[name]["relations"].setdefault(rel_name.strip(), []).append((rel_name.strip(), relation.strip()))
                
                id = getIDByName(data, rel_name.strip())

                results.append(f"{rel_name.strip()}: {relation.strip()} - {id}")
                entry["Parentesco"] = results
                

        people[name]["relations"] = {}

# Escrever o JSON atualizado de volta ao arquivo
with open(data_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Conversão concluída com sucesso!")
