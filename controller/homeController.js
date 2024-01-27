const file_list = require('../model/file_list')
//multer is used to add the files in the upload folder
const upload = require('../config/multer');
const fs = require('fs'); // Import the promises version of fs
const path=require('path')
//To read csv files csv-parser module is required
const csvParser = require('csv-parser');
const { ObjectId } = require('mongodb');

// function for redirecting to main home page
module.exports.home = async function (req, res) {
    try {
        const files = await file_list.find({});
        console.log(files);  // Log habits to console
        return res.render('home', { files });
    } catch (err) {
        console.error("Error fetching habits:", err);
        return res.status(500).send("Internal Server Error");
    }
};
// function for uploading the csv file
module.exports.upload=  async function (req, res) {
    try {
        // Access the uploaded file through req.file
        const fileName = req.file.originalname; // Assuming originalname contains the file name
  
        // Check if a file with the same name already exists
        const existingFile = await file_list.findOne({value: fileName });
  
        if (existingFile) {
            console.log("existing")
          // File with the same name already exists
          return res.status(400).json({ success: false, message: 'File with the same name already exists' });
        }
  
        // Save file information to the database
        const newFile = await file_list.create({ value: fileName, fileName });
  
        res.redirect('back')
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
// function for parsing the csv data 
module.exports.getFileData = async function (req, res) {
    try {
        const objectId = new ObjectId(req.params.fileId);
        const filename = await file_list.findOne({ _id: objectId });

        console.log('Filename from Database:', filename);
        if (!filename) {
            return res.status(400).json({ error: 'Filename is missing' });
        }

        // Read the content of the file from the 'uploads' folder
        const filePath = path.join(__dirname, '../uploads', filename.value);
        console.log('File Path:', filePath);
        // Parse CSV data using csv-parser
        const parsedData = await new Promise((resolve, reject) => {
            const data = [];
            
            const stream = fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    data.push(row);
                })
                .on('end', () => {
                    resolve(data);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        // Send the parsed data as JSON
        res.json(parsedData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
//function for deleting and removing the files
module.exports.removeFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;

        // Retrieve the file details using the fileId
        const fileDetails = await file_list.findOne({ _id: fileId });
        if (!fileDetails) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete the file from the file system (assuming you have stored it in the 'uploads' folder)
        const filePath = path.join(__dirname, '../uploads', fileDetails.value);
        fs.unlinkSync(filePath);

        // Remove the file details from the database
        await file_list.deleteOne({ _id: fileId });

        res.json({ success: true, message: 'File removed successfully' });
    } catch (error) {
        console.error('Error removing file:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};