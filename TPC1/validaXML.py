import os
from lxml import etree

def validaXML(xml, xsd):
    try:
        schema = etree.XMLSchema(file=xsd)
        xmlparser = etree.XMLParser(schema=schema)
        xml_tree = etree.parse(xml, xmlparser)
        if schema.validate(xml_tree):
            print(f"{xml} é válido.")
        else:
            print(f"{xml} é inválido:")
            print(schema.error_log)
       
    except etree.XMLSyntaxError as e:
        print(f"Erro ao analisar XML {xml}: {e}")

def valida_XMLs(pasta, xsd):
    for filename in os.listdir(pasta):
        if filename.endswith('.xml'):
            xml_file = os.path.join(pasta, filename)            
            validaXML(xml_file, xsd)

pasta = './MapaRuas-materialBase/texto'
xsd = './MapaRuas-materialBase/MRB-rua.xsd'

valida_XMLs(pasta, xsd)
