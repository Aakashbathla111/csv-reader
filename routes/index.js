const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');
const upload = require('../config/multer');
router.get('/',homeController.home)
router.post('/upload', upload.single('csvFile'), homeController.upload);
router.get('/getFileData/:fileId', homeController.getFileData);
router.delete('/removeFile/:fileId', homeController.removeFile); 

module.exports=router