const express = require('express');
// include CLOUDINARY:
const fileUploader = require('../configs/cloudinary.config');
const router = express.Router();




router.post('/upload', fileUploader.single('imageURL'), (req, res, next) =>{
  const imageURL = req.file && req.file.path  
  res.json({ imageURL: imageURL });
});
module.exports = router;


// 'https://res.cloudinary.com/dshuazgaz/image/upload/v1602411437/avatar_el8zal.webp'
