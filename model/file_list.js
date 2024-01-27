const mongoose=require('mongoose')

const fileschema=new mongoose.Schema({
    value:{
        type: String,
        required: true
    }
})

const file_list=mongoose.model('file',fileschema)
module.exports=file_list