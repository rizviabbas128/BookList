const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {type:String, require:true},
    author: {type: String, require:true},
    ISBN: {type: String, require:true},
    image_file: {type: String, require:true},
    description: {type:String, require:true},
    published: {type: String, require:true},
},{timestamps:true} 
)

const model = mongoose.model('Books' , bookSchema);

module.exports = model;