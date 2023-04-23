const express = require("express");
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload")
const cors = require('cors');
const Book = require('../schema/Book');
const path = require('path');

const router = express();
router.use(express.json());
router.use(cors())
router.use(fileUpload())

router.post("/add", (req, res) => {
    // console.log(req.files.image_file); // image_file : --> is the ( KEY ) for -> files we have set up in the frontend 
    const {title, author,ISBN, description,published} = req.body; // capturing body other than files
    console.log(title,author,ISBN,description,published);
    const {image_file} = req.files; // req.files : is an Object that will have all the files , capturing here
    console.log(image_file)
    image_file.mv("./uploads/"+image_file.name, async (err) => { // concatinating relative path with file-name like : ./uploads/+image_file.name
        if(err) {
            res.json({
                message: err
            })
        }else {
            try {
                const data = await Book.create({
                    ...{title,author,ISBN,description,published},image_file: image_file.name
                })
                 res.json({
                    message: "success",
                    data
                })
            }catch(err) {
                 res.json({
                    message: err.message
                    
                })
            }
        }
    }); // uploads is the folder where i will push file and image_file.name is the name of image with which i want to save the file

})

router.get("/all", async (req, res) => {
    try {
        const data = await Book.find();
        return res.json({
            status: "success",
            data
        })
    }catch(err) {
        return res.json({
            status: "failed"
        })
    }
})

router.get("/images/:fileName", async (req, res) => {
    console.log(`../uploads/${req.params.fileName}`)
    res.sendFile(path.join(__dirname, `../uploads/${req.params.fileName}`))
})

router.put("/:id" , async (req, res) => {
    try {
        const data = await Book.updateOne({_id: req.params.id}, req.body);
        return res.status(200).json({
            status: "successfully updated book",
            data:data
        })
    }catch(err) {
        return res.status(500).json({
            status: "Failed to updated",
            message: err.message,
        })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await Book.deleteOne({_id:req.params.id});
        return res.status(200).json({
            status: "successfully deleted"
        })
    }catch(err) {
        return res.status(500).json({
            status: "Failed to delete",
            message: err.message,
        })
    }
})

router.get("/:id" ,async (req, res) => {
    try {
        let data = await Book.findOne({_id: req.params.id})
        return res.status(201).json({
            status: "fetch particular book",
            data
        })
    }catch(err) {
        return res.status(500).json({err})
    }
})

module.exports = router;