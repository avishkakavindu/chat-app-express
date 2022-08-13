const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require("cors");
const PORT = 8070;

var messages = [
    {name: 'Tim', message: 'hi'},
    {name: 'John', message: 'hello'}
]

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(cors());
// setting up bosy parser to support url encoded requests 
app.use(bodyParser.urlencoded({extended: false}));

// get messages
app.get('/messages', (req, res) => {
    res.send(messages);
});

// create message
app.post('/messages', (req, res) => {
    messages.push(req.body);

    io.emit('message', req.body)

    res.sendStatus(200);
});

io.on('connection', (socket) => {
    console.log('User connected!');
});

const server = http.listen(PORT, () => {
    console.log(`Server is listening on port ${server.address().port}`)
});