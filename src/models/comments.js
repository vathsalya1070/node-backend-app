const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    article_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    user_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    comment: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('comments', dataSchema)
