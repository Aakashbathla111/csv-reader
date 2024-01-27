const express = require('express');
const app = express();
const path=require('path')

// const customMware=require('./config/middleware')
const db = require('./config/mongoose')
const file_list = require('./model/file_list')
const session = require('express-session');
let port = 8000;
// to tell breowser/server to use ejs as view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
//session cookie req.flash requires session cookie
app.use(session({
    secret: 'Codeial', 
    resave: false,
    saveUninitialized: true
  }));
// it is use to handle middle ware here we are using express.urlenceode to use the parser
app.use(express.urlencoded());

app.use('/',require('./routes')) 
app.use(express.static('./assets')) // for getting static
app.listen(port,function(err){
    if(err){
        console.log(`error in running the ${port}`)
        return;
    }
    console.log(`Server is running @ ${port}`)
})