// setting up connection with database
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/file_list')
const db = mongoose.connection
db.on('error',console.error.bind(console,'Error connecting to database'))
db.once('open',function(){
    console.log('Successful connected to database')
})