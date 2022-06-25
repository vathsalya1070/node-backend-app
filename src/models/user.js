const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    bookmark_articles: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]

})

module.exports = mongoose.model('user', dataSchema)
