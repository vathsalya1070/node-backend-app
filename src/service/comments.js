const comments = require('../models/comments');


exports.create = async (input) => {
    const data = new comments(input)
    const result = await data.save();
    return result;
};

exports.findByIdAndUpdate = async (id, updatedData, options = {}) => {
    const result = await comments.findByIdAndUpdate(id, updatedData, options);
    return result;
};

exports.updateOne = async (condition, updatedData, options = {}) => {
    const result = await comments.updateOne(condition, updatedData, options);
    return result;
};

exports.findAll = async (condition = {}) => {
    const result = await comments.find(condition);
    return result;
};
