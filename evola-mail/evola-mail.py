import json
import requests
import time
import pytz
import os
from datetime import datetime, timedelta

clientId = os.getenv('CLIENTID')
corporationId = os.getenv('CORPID')
characterId = os.getenv('CHARACTERID')

tok = open("./data/evola-tokens.txt")
tokens = tok.read()
print(tokens)
access_token = json.loads(tokens)['access_token']
refreshToken = json.loads(tokens)['refresh_token']

sentMailContractIDs = []

def testSendMail():
    headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json"
    }

    data = {
      "approved_cost": 0,
      "body": "Test Body <url=https://www.pandemic-horde.org/forum/index.php?threads/evola-deliveries-horde-courier-service.3266/>LINK</url>",
      "recipients": [
        {
          "recipient_id": 2115718841,
          "recipient_type": "character"
        }
      ],
      "subject": "Test Subject"
    }

    res = requests.post(
        "https://esi.evetech.net/latest/characters/" + characterId + "/mail/?datasource=tranquility",
        data = json.dumps(data),
        headers=headers,
    )

    print(res.json())
    refreshTokens(res)

def sendMail(contract):
    #Send mail
    if contract['acceptor_id'] == 2115718841:
        contract['acceptor_id'] = 2116763424
        
    headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json"
    }

    data = {
      "approved_cost": 0,
      "body": "Thank You for using Evola! Your <url=contract:" + str(contract['start_location_id']) + "//" + str(contract['contract_id']) + ">package</url> has been delivered. If you enjoyed our service, remember to check us out on <url=https://discord.gg/ZGt6eUwuXt/>Discord</url> and <url=https://www.pandemic-horde.org/forum/index.php?threads/evola-deliveries-horde-courier-service.3266/>our forum post</url> for updated pricing and route status. -Evola",
      "recipients": [
        {
          "recipient_id": contract['issuer_id'],
          "recipient_type": "character"
        }
      ],
      "subject": "Your Delivery"
    }

    res = requests.post(
        "https://esi.evetech.net/latest/characters/" + characterId + "/mail/?datasource=tranquility",
        data = json.dumps(data),
        headers=headers,
    )

    print(res.json())
    refreshTokens(res)

def refreshTokens(res):
    global access_token
    global refreshToken

    res_json = safe_json(res)
    if not res_json:
        print("Failed to refresh token or bad response.")
        return

    # Check if token is expired
    if "error" in res_json:
        if res_json['error'] == "token is expired":
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

            res_json = safe_json(res)
            if not res_json:
                print("Failed to refresh token!")
                return

            access_token = res_json.get('access_token')
            refreshToken = res_json.get('refresh_token')

            saveString = json.dumps(res_json)
            with open("./data/evola-tokens.txt", 'w') as filetowrite:
                filetowrite.write(saveString)

            print("refreshed token")

def safe_json(res):
    try:
        return res.json()
    except ValueError:
        print(f"Failed to decode JSON. Status: {res.status_code}, Body: {res.text}")
        return None

def checkContracts():
    allContracts = []
    page = 1

    headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json"
    }

    while True:
        res = requests.get(
            f"https://esi.evetech.net/latest/corporations/{corporationId}/contracts/?datasource=tranquility&page={page}",
            headers=headers,
        )

        data = safe_json(res)
        if not data or "error" in data:
            break

        allContracts.append(data)
        page += 1

    #print(allContracts)

    utc = pytz.timezone('utc')
    now = datetime.now(utc)
    date_time = now.strftime("%Y-%m-%dT%H:%M:%SZ")
        
    needMailContracts = []
    
    for contractChunk in allContracts:
        for contract in contractChunk:
            if contract['status'] == "finished" and contract['type'] == "courier":
                if contract['date_completed'] > startTime and contract['contract_id'] not in sentMailContractIDs:
                    print("new contract")
                    needMailContracts.append(contract)
                    sentMailContractIDs.append(contract['contract_id'])

    #now send mails
    #currently send to replacent while I test
    for contract in needMailContracts:
        print("New complete: ")
        print(contract)
        sendMail(contract)

    refreshTokens(res)

utc = pytz.timezone('utc')
now = datetime.now(utc)
startTime = now.strftime("%Y-%m-%dT%H:%M:%SZ")

while True:
    #Check contracts
    checkContracts()

    #Test send mail
    #testSendMail()

    #loop timer
    time.sleep(10)
