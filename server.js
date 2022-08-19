require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

// compile User model
const User = mongoose.model('User', userSchema);

// Compile Message model
const Message = mongoose.model('Message', messageSchema);

// register
app.post('/register', async(req, res) => {
    let  { username, password } = req.body;

    if (!username || typeof username!== 'string') {
        let context = {
            status: 'error',
            error: 'Invalid username format!'
        }
        return res.json(context);
    }
    if (!username || typeof username!== 'string') {
        let context = {
            status: 'error',
            error: 'Invalid password format!'
        }
        return res.json(context);
    }
    if (password.length < 5) {
        let context = {
            status: 'error',
            error: 'Password length need to exceed 4 letters'
        }
        return res.json(context);
    }

    // console.log('prev:', password);
    password = await bcrypt.hash(password, 10);
   
    try {
        const response = await User.create({
            username,
            password
        });
        console.log(response);
    } catch (error) {
        if (error.code === 11000) {
            let context = {
                status: 'error',
                error: 'Username already taken!'
            }
            return res.json(context);
        }
        throw error;
    }
    return res.status(200);
});

// get messages
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

// create message
app.post('/messages', async(req, res) => {

    try {

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
    } catch (err) {
        res.sendStatus(500);
        return console.error(err);
    } finally {
        // this block will run no matter what
        console.log('Post called!');
    }    
});

// get messages belongs to particular user by username
app.get('/messages/:user', (req, res) => {
    let user = req.params.user;

    Message.find({name: user}, (err, messages) => {
        res.send(messages);
    });
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