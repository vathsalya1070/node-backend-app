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
    comment_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    reply: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('reply', dataSchema)
