require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require("cors");
const mongoose = require('mongoose');

const PORT = 8070;


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(cors());
// setting up bosy parser to support url encoded requests 
app.use(bodyParser.urlencoded({extended: false}));


const DB_PASSWORD = process.env.PASSWORD;

mongoose.Promise = Promise;

const dbUrl = `mongodb+srv://user:${DB_PASSWORD}@cluster0.qyekysk.mongodb.net/?retryWrites=true&w=majority`;

// Mongoose Schema
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    name: String,
    message: String
});

// Compile Message model
const Message = mongoose.model('Message', messageSchema);

// get messages
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

// create message
app.post('/messages', async(req, res) => {
    let message = new Message(req.body);
   
    let savedMessage = await message.save()

    console.log('saved');

    let censored = await Message.findOne({message: 'badword'});
    
    if(censored) {
        await Message.deleteOne({_id: censored.id});
    }else {
        io.emit('message', req.body);
    }      
    
    res.sendStatus(200);      
    
    // .catch((err) => {
    //     response.sendStatus(500);
    //     return console.error();
    // });

    
});

io.on('connection', (socket) => {
    console.log('User connected!');
});

mongoose.connect(dbUrl, (err) => {
    console.log('Mongo DB connection', err);
});

const server = http.listen(PORT, () => {
    console.log(`Server is listening on port ${server.address().port}`)
});