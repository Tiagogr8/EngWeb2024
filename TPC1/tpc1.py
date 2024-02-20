import xml.etree.ElementTree as ET
import os


html_template = '''
<!DOCTYPE html>
<html>
<head>
    <title>Rua Information</title>
    <style>
        figure {
            margin: 0;
            padding: 0;
            text-align: center;
        }
        figcaption {
            font-style: italic;
        }
        figure img {
            margin-top: 2rem;
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            border: 2px solid #ddd;
        }
        figure img atual{
            max-width: 50%;
            height: auto;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
'''

if not os.path.exists("html"):
    os.makedirs("html")

xml_directory = "texto"

for filename in os.listdir(xml_directory):
    html = html_template
    if filename.endswith(".xml"):
        xml_file = os.path.join(xml_directory,filename)
        tree = ET.parse(xml_file)
        root = tree.getroot()

        numero = root.find("./meta/número").text
        nome = root.find("./meta/nome").text
        html += "<h1> Rua " + numero + ": " + nome + "</h1>"

        # texto
        html+= "<div>\n"
        for element in root.findall("./corpo/para"):
            text = ""
            if element is not None:
                text += element.text or ""
                for sub_element in element:
                    sub_text = ""
                    if sub_element.text:
                        sub_text += sub_element.text
                    if sub_element.tail:
                        sub_text += sub_element.tail
                    text += sub_text
            html += "<p>" + text + "</p>\n"
        html += "</div>\n"

        #imagens
        html += "<div>\n"
        for figura in root.findall("./corpo/figura"):
            imagem = figura.find("imagem").attrib['path']
            legenda = figura.find("legenda").text
            html += f"<div style='margin-bottom: 20px;'>\n<figure>\n<img src=\"{imagem}\" alt=\"{legenda}\" style=\"max-width: 50%; height: auto;\">\n<figcaption>{legenda}</figcaption>\n</figure>\n</div>\n"
        html += "</div>\n"

        # Imagens Atuais
        atual_directory = "atual"
        html += "<h2 style='margin-top: 5rem;'>Imagens Atuais: </h2>"

        for imagem in os.listdir(atual_directory):
            if imagem.startswith(f"{str(int(numero))}-"):
                caminho_img = os.path.join("../atual", imagem)
                html += f"<div style='margin-bottom: 20px;'>\n<figure>\n<img src=\"{caminho_img}\" style=\"max-width: 40%; height: auto;\">\n\n</figure>\n</div>\n"

        #### Casas
        html += "<div>\n"
        html += "<h2 style='margin-top: 4rem;'>Lista de Casas</h2>\n<table border='1'>\n<tr><th>Número</th><th>Enfiteuta</th><th>Foro</th><th>Descrição</th></tr>\n"
        for casa in root.findall("./corpo/lista-casas/casa"):
            numero_casa = casa.find("número").text if casa.find("número") is not None else ""
            enfiteuta = casa.find("enfiteuta").text if casa.find("enfiteuta") is not None else ""
            foro = casa.find("foro").text if casa.find("foro") is not None else ""
            desc_element = casa.find("desc")
            casa_desc = ""
            if desc_element is not None:
                for desc in desc_element:
                    casa_desc = ""
                    if desc is not None:
                        casa_desc += desc.text or ""
                        for d in desc:
                            sub_text = ""
                            if d.text:
                                sub_text += d.text
                            if d.tail:
                                sub_text += d.tail
                            casa_desc += sub_text
            html += f"<tr><td>{numero_casa}</td><td>{enfiteuta}</td><td>{foro}</td><td>{casa_desc}</td></tr>\n"
        html += "</table>\n"
        html += "</div>\n"


        # Voltar ao index
        html += "<div>\n"
        html += "<h4><a href='../index.html' style='text-decoration: none; color: black;'>Voltar ao Índice</a></h4>\n"
        html += "</div>\n"

        html += "</body>"
        html += "</html>"
        html_filename = nome + ".html"
        html_output_path = os.path.join("html", html_filename)
        with open(html_output_path, "w", encoding="utf-8") as html_file:
            html_file.write(html)
        html_file.close()

###########################################################
######################    Index    ########################
###########################################################

html_files = []
html_directory = "html"
for filename in os.listdir(html_directory):
    if filename.endswith(".html"):
        html_files.append(filename)

tree = ET.parse("manifest.xml")
root = tree.getroot()

title = root.find("./meta/title").text
date = root.find("./meta/date").text
author_id = root.find("./meta/author/id").text
author_name = root.find("./meta/author/nome").text
uc_sigla = root.find("./meta/uc/sigla").text
uc_name = root.find("./meta/uc/nome").text
resumo = [p.text for p in root.findall("./resumo/p")]
resultados = "\n".join([p.text for p in root.findall("./resumo/p")])
index_html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>{title}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
        }}
        h1 {{
            color: black;
        }}
        p {{
            margin-bottom: 10px;
        }}
        ul {{
            list-style-type: none;
            padding: 0;
        }}
        li {{
            margin-bottom: 10px;
        }}
        a {{
            text-decoration: none;
            color: black;
            transition: color 0.3s;
        }}
        a:hover {{
            color: #0056b3;
        }}
    </style>
</head>
<body>
    <h1>{title}</h1>
    <p><strong>Data:</strong> {date}</p>
    <p><strong>Autor:</strong> {author_name} ({author_id})</p>
    <p><strong>Unidade Curricular:</strong> {uc_name} ({uc_sigla})</p>
    <p><strong>Resumo:</strong></p>
    <p>{"<br>".join(resumo)}</p>
    <h3 style = 'margin-top : 2rem'>Resultados Obtidos (Índice das Ruas ordenadas alfabeticamente): </h3>
    <ul>
"""

ruas = []
for html_file in html_files:
    rua_name = os.path.splitext(html_file)[0].strip()  
    ruas.append(rua_name)

# Ordenar ruas em ordem alfabética
ruas.sort()
for rua_name in ruas:
    index_html += f"<li><a href='html/{rua_name}.html'>{rua_name}</a></li>\n"

index_html += """
    </ul>
</body>
</html>
"""
with open("index.html", "w") as index_file:
    index_file.write(index_html)