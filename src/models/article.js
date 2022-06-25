const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    user: {
        required: true,
        type: String
    },
    tag: {
        required: false,
        type: String
    }
})

module.exports = mongoose.model('article', dataSchema)
