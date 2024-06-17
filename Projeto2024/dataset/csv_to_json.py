import pandas as pd
import json
import re
from datetime import datetime

# Função para converter datas
def convert_date_format(date_str):
    if date_str:
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').strftime('%d-%m-%Y')
        except ValueError:
            return date_str  # Retorna a string original se não for possível converter
    return date_str

def extract_locality(scope_content):
    match = re.search(r'Natural e/ou residente em (.+?)(?=\.)', scope_content)
    if match:
        return match.group(1)
    return ""

# Leitura do csv
df = pd.read_csv('PT-UM-ADB-DIO-MAB-006.csv', delimiter=';')

# Remover o primeiro registro
df = df.iloc[1:]

# Seleção das colunas desejadas
fields = ['_id', 'UnitTitle', 'UnitDateInitial', 'UnitDateFinal', 'UnitDateInitialCertainty', 'UnitDateFinalCertainty', 'Repository', 'ScopeContent', 'Creator', 'Created','RelatedMaterial', "PhysTech", "PhysLoc", "PreviousLoc","LangMaterial"]
df_fields = df[fields]

# Substituir NaN por strings vazias
df_fields = df_fields.fillna("")

# Converter datas
df_fields['UnitDateInitial'] = df_fields['UnitDateInitial'].apply(convert_date_format)
df_fields['UnitDateFinal'] = df_fields['UnitDateFinal'].apply(convert_date_format)

df_fields['Localidade'] = df_fields['ScopeContent'].apply(extract_locality)

# DataFrame para dicionário
data_dict = df_fields.to_dict(orient='records')

# Garantir que _id seja tratado como string
for record in data_dict:
    record['_id'] = str(record['_id'])

# Dicionário para json
data_json = json.dumps(data_dict, indent=4, ensure_ascii=False)

# Escrita do json em um arquivo
with open('db.json', 'w', encoding='utf-8') as f:
    f.write(data_json)

print("Conversão concluída com sucesso!")
