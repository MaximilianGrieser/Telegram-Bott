const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const { request } = require('express');
const jsonParser = bodyParser.json();
const cors = require('cors')

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

var con = mysql.createConnection({
    host: "localhost",
    user: "Jarvis",
    password: "187",
    database: "telegram_bot"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get("/info/:chat_id", jsonParser, (req, res) => {
    con.query("SELECT name, Due, description FROM remainder WHERE chatID = '" + req.params.chat_id + "'", function(err, ress){
        if(err) throw err
        res.json(ress);
        console.log("All reaminders requested " + req.params.chat_id);
    });
})

const server = app.listen(port, () => console.log('Telegram-Bot App listening on port ' + port + '!'));
module.exports = server;