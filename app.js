const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//ROUTES - Importing routes
const apiRoutes = require('./api/routes/api');


//DATABASE - Importing Database and Connecting it.
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tictactoe');

const database = mongoose.connection;
database.on('error',console.error.bind(console, 'connection error'));
database.once('open', function(){
    console.log('connected to database');
});

//Application Configuration
app
    .use(cors())
    .use(express.static('./public'))
    .use(bodyParser.urlencoded({extended:true}))
    .use(bodyParser.json())
    .use('/api',apiRoutes)
    .use(function(req,res,next){

    });

const server = app.listen(process.env.PORT || 3000, () => {
    const port = server.address().port;

    console.log('Tic Tac Toe Game Api is running in port: ', port);
});