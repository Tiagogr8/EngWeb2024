import requests

url = 'http://localhost:7777/users/register'
data = { 'username': 'admin', 'password': 'admin', 'email': 'admin@admin', 'name': 'admin', 'level': 'admin'}
r = requests.post(url, data=data)
print(r.text)

