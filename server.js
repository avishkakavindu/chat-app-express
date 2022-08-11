const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8070;

var messages = [
    {name: 'Tim', message: 'hi'},
    {name: 'John', message: 'hello'}
]

app.use(express.static(__dirname));
app.use(bodyParser.json());
// setting up bosy parser to support url encoded requests 
app.use(bodyParser.urlencoded({extended: false}));

// get messages
app.get('/messages', (req, res) => {
    res.send(messages);
});

// create message
app.post('/messages', (req, res) => {
    messages.push(req.body);
    res.sendStatus(200);
});

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${server.address().port}`)
});