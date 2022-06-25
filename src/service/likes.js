const likes = require('../models/likes');


exports.create = async (input) => {
    const data = new likes(input)
    const result = await data.save();
    return result;
};

exports.findByIdAndUpdate = async (id, updatedData, options = {}) => {
    const result = await likes.findByIdAndUpdate(id, updatedData, options);
    return result;
};

exports.updateOne = async (condition, updatedData, options = {}) => {
    const result = await likes.updateOne(condition, updatedData, options);
    return result;
};

exports.findAll = async (condition = {}) => {
    const result = await likes.find(condition);
    return result;
};


exports.findOne = async (condition) => {
    return await likes.findOne(condition);
};
