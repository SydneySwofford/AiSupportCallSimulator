import requests

url = "http://localhost:8000/chat"
data = {
    "message": "I can’t log into my account",
    "persona": "empathetic",
    "scenario": "login issue"
}

response = requests.post(url, json=data)
print(response.status_code)
print(response.json())
