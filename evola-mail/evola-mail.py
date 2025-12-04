import json
import requests
import time
import pytz
import os
from datetime import datetime, timedelta

# how often to refresh contracts from ESI
CHECK_INTERVAL = 60  # seconds

# location for persisted data
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CONTRACTS_FILE = os.path.join(DATA_DIR, "tracked-contracts.json")
os.makedirs(DATA_DIR, exist_ok=True)

# === Load ENV Variables ===
clientId = os.getenv('CLIENTID')
corporationId = os.getenv('CORPID')
characterId = os.getenv('CHARACTERID')

if not clientId or not corporationId or not characterId:
    raise ValueError("Missing one or more environment variables: CLIENTID, CORPID, CHARACTERID")

# === Load Tokens ===
with open(os.path.join(DATA_DIR, "evola-tokens.txt"), 'r') as tok:
    tokens = json.load(tok)
    access_token = tokens['access_token']
    refreshToken = tokens['refresh_token']

# === Tracking ===
trackedContracts = {}

# Load tracked contracts from disk if available
def loadTrackedContracts():
    global trackedContracts
    if os.path.exists(CONTRACTS_FILE):
        try:
            with open(CONTRACTS_FILE, 'r') as f:
                data = json.load(f)
                # keys are contract ids, store as ints for consistency
                trackedContracts = {int(k): v for k, v in data.items()}
        except Exception as e:
            print(f"Failed to load tracked contracts: {e}")
            trackedContracts = {}
    else:
        trackedContracts = {}

# Persist tracked contracts to disk
def saveTrackedContracts():
    try:
        with open(CONTRACTS_FILE, 'w') as f:
            json.dump(trackedContracts, f)
    except Exception as e:
        print(f"Failed to save tracked contracts: {e}")

# initialize contracts from file on startup
loadTrackedContracts()

# === Safe JSON Parser ===
def safe_json(res):
    try:
        return res.json()
    except ValueError:
        print(f"Failed to decode JSON. Status: {res.status_code}, Body: {res.text}")
        return {}

# === Token Refresher (Manual Trigger) ===
def refreshTokenOnly():
    global access_token, refreshToken

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "login.eveonline.com",
        "Authorization": "Basic " + clientId
    }

    form_values = {
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
    }

    res = requests.post(
        "https://login.eveonline.com/v2/oauth/token/",
        data=form_values,
        headers=headers,
    )

    new_tokens = safe_json(res)
    if not new_tokens or 'access_token' not in new_tokens:
        print("Failed to refresh token: ", new_tokens)
        return

    access_token = new_tokens.get('access_token')
    refreshToken = new_tokens.get('refresh_token')

    with open(os.path.join(DATA_DIR, "evola-tokens.txt"), 'w') as f:
        json.dump(new_tokens, f)

    print("Access token refreshed successfully.")

# === Send Mail on Completion ===
def sendMail(contract):
    if contract.get('acceptor_id') == 2117867283:
        contract['acceptor_id'] = 2116763424

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    data = {
        "approved_cost": 0,
        "body": f"Thank You for using Evola! Your <url=contract:{contract['start_location_id']}//{contract['contract_id']}>package</url> has been delivered. If you enjoyed our service, remember to check us out on <url=https://discord.com/invite/SS2GFCPkt2>Discord</url>. for updated pricing and route status. -Evola",
        "recipients": [
            {
                "recipient_id": contract['issuer_id'],
                "recipient_type": "character"
            }
        ],
        "subject": "Your Delivery"
    }

    res = requests.post(
        f"https://esi.evetech.net/latest/characters/{characterId}/mail/?datasource=tranquility",
        data=json.dumps(data),
        headers=headers,
    )

    try:
        response_data = res.json()
        print(response_data)
        if isinstance(response_data, dict) and "error" in response_data:
            print(f"Mail send error: {response_data['error']}")
    except Exception as e:
        print(f"Failed to decode mail response: {e}")

# === Update Tracked Contracts ===
def updateTrackedContracts(allContracts):
    global trackedContracts

    currentMap = {
        c['contract_id']: c
        for c in allContracts
        if c['type'] == "courier"
    }

    # Add new outstanding contracts
    for cid, contract in currentMap.items():
        if cid not in trackedContracts and contract['status'] in ("outstanding", "in_progress"):
            print(f"Tracking new contract: {cid}")
            trackedContracts[cid] = contract

    # Detect completions or disappearances
    for cid in list(trackedContracts.keys()):
        old = trackedContracts[cid]
        updated = currentMap.get(cid)

        if updated is None:
            print(f"Contract {cid} has vanished. Assuming expired/withdrawn.")
            del trackedContracts[cid]
            continue

        if updated['status'] == "finished":
            print(f"Contract {cid} is now finished.")
            sendMail(updated)
            del trackedContracts[cid]
            continue
        
         # update status for in-progress/outstanding changes
        trackedContracts[cid] = updated

    # Persist any changes
    saveTrackedContracts()

# === Fetch Contracts from ESI ===
def checkContracts():
    global access_token

    allContracts = []
    page = 1
    max_pages = 1
    error_occurred = False  # 🕯️A little flag to tell if all went well...

    while page <= max_pages:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        url = f"https://esi.evetech.net/latest/corporations/{corporationId}/contracts/?datasource=tranquility&page={page}"
        res = requests.get(url, headers=headers)

        if res.status_code == 401:
            print("Token expired or unauthorized. Attempting to refresh...")
            refreshTokenOnly()
            continue  # retry page fetch after refresh

        if res.status_code != 200:
            print(f"Error fetching page {page}: {res.status_code}")
            error_occurred = True  # 💥 Trouble happened, mark it...
            break

        data = safe_json(res)
        if not data:
            print(f"No data on page {page}, stopping.")
            error_occurred = True  # 🧊 Still an issue, my liege
            break

        allContracts.extend(data)

        if page == 1:
            try:
                max_pages = int(res.headers.get("X-Pages", "1"))
            except ValueError:
                print("Invalid X-Pages header; defaulting to 1.")

        page += 1

    if not error_occurred:
        updateTrackedContracts(allContracts)  # 🎀 Only if everything is nice and clean!
    else:
        print("Skipped updating tracked contracts due to earlier errors.")

# === Optional Test Mail ===
def testSendMail():
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    data = {
        "approved_cost": 0,
        "body": "Test Body <url=https://www.pandemic-horde.org/forum/index.php?threads/evola-deliveries-horde-courier-service.3266/>LINK</url>",
        "recipients": [
            {
                "recipient_id": 2117867283,
                "recipient_type": "character"
            }
        ],
        "subject": "Test Subject"
    }

    res = requests.post(
        f"https://esi.evetech.net/latest/characters/{characterId}/mail/?datasource=tranquility",
        data=json.dumps(data),
        headers=headers,
    )

    try:
        print(res.json())
    except Exception as e:
        print(f"Failed to decode test mail response: {e}")

# === Optional Start Time (unused, placeholder) ===
utc = pytz.timezone('utc')
now = datetime.now(utc)
startTime = (now - timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%SZ")

# === Main Loop ===
while True:
    try:
        checkContracts()
        time.sleep(CHECK_INTERVAL)
    except Exception as e:
        print(f"Unexpected error: {e}")
        time.sleep(CHECK_INTERVAL)
