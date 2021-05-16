import requests
import datetime
import mysql.connector
from time import sleep

global OFFSET
OFFSET = 0

#Create TABLE remainder (id int(255) AUTO_INCREMENT PRIMARY KEY, Name varchar(255), due datetime, description varchar(255), chatID int(255), shown bool)

mydb = mysql.connector.connect(
  host="localhost",
  user="Jarvis",
  password="187",
  database="telegram_bot"
)

botToken = "1840064856:AAGo08shyfsTvVxDfCxRen0oqS4lMKYONEI"

global requestURL
requestURL = "https://api.telegram.org/bot" + botToken + "/getUpdates"
sendURL = "https://api.telegram.org/bot" + botToken + "/sendMessage"

def update (url):
    global OFFSET

    try:
        update_raw = requests.get(url + "?offset=" + str(OFFSET))
        update = update_raw.json()
        result = extract_result(update)

        if(result != False):
            OFFSET = result['update_id'] + 1

            chat_id = result['message']['chat']['id']
            text = result['message']['text']

            check_for_commands(text, chat_id)

    except requests.exceptions.ConnectionError:
        pass
    
    check_for_remainders()

def extract_result (dict):
    result_array = dict['result']

    if result_array == []:
        return False
    else:
        result_dic = result_array[0]
        return result_dic

def check_for_commands (text, chat_id):
    cmd = text.split(' ')
    cmd = cmd[0]
    message = "blank message"
    if (cmd == "/help"):
        message = "Diese Comands Stehen zur Verfuegung:\n /newRemainder ?name ?description ?YYYY-MM-DD HH:MM)\n /showRemainder shows every Remainder \n /showChat_id shows your chat id for Website"
    if (cmd == "/newRemainder"):
        message = newRemainder(text, chat_id)
    if (cmd == "/showRemainder"):
        message = showRemainder(chat_id)
    if (cmd == "/showChat_id"):
        message = chat_id

    send_message (chat_id, message)

def newRemainder (text, chat_id):
    data = text.split('?') 
    name = data[1]
    description = data[2]
    due = data[3] + ":00"

    mycursor = mydb.cursor()

    sql = "INSERT INTO remainder (Name, due, description, chatID, shown) VALUES (%s, %s, %s, %s, false)"
    val = (name, due, description, str(chat_id))
    mycursor.execute(sql, val)

    mydb.commit()

    return "Added Remainder"

def showRemainder (chat_id):
    mycursor = mydb.cursor()

    mycursor.execute("SELECT Name, due, description FROM remainder WHERE chatID =" + str(chat_id))

    myresult = mycursor.fetchall()
    ret = ""
    for r in myresult:
        ret = ret + str(r) + "\n"
    return ret

def check_for_remainders():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    print(now)
    mycursor = mydb.cursor()

    mycursor.execute("SELECT id, Name, due, description, chatID FROM remainder WHERE shown = false")

    myresult = mycursor.fetchall()
    for r in myresult:
        if(r[2].strftime("%Y-%m-%d %H:%M") == now):
            send_message (r[4], "Your Remainder " + r[1] + " is Due !!!!\n Description: " + r[3])

            cursor = mydb.cursor()
            cursor.execute("UPDATE remainder SET shown = true WHERE id = " + str(r[0]))

def send_message (chatId, message):
    requests.post(sendURL + "?chat_id=" + str(chatId) + "&text=" + str(message))

while True:
    update(requestURL)
    sleep(1)