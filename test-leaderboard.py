import requests
import json
import random
import time

BASE_URL = "http://localhost:9090/api"

print("Waiting for services to start...")
time.sleep(30)  # Wait for services

def register_and_login():
    num = random.randint(1000, 9999)
    username = f"farmer{num}"
    print(f"Registering {username}...")
    
    reg_res = requests.post(f"{BASE_URL}/auth/register", json={
        "username": username,
        "email": f"{username}@example.com",
        "password": "password123"
    })
    print("Register:", reg_res.status_code)
    
    log_res = requests.post(f"{BASE_URL}/auth/login", json={
        "username": username,
        "password": "password123"
    })
    token = log_res.json()["token"]
    print("Login OK")
    return token, username

token, user = register_and_login()
headers = {"Authorization": f"Bearer {token}"}

print("\n--- Getting Leaderboard ---")
lb_res = requests.get(f"{BASE_URL}/sustainability/leaderboard?period=ALL", headers=headers)
print("Leaderboard status:", lb_res.status_code)
if lb_res.status_code == 200:
    print(json.dumps(lb_res.json(), indent=2))
else:
    print(lb_res.text)

print("\n--- Getting Admin Notifications (Test 403) ---")
# To test admin, we need admin credentials. 
# We can just hit /api/notifications/my as Farmer to see if it works.
notif_res = requests.get(f"{BASE_URL}/notifications/my", headers=headers)
print("Notifications status (Farmer):", notif_res.status_code)
