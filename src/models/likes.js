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
    count: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Likes', dataSchema)
