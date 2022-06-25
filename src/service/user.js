const user = require('../models/user');


exports.create = async (input) => {
    const data = new user(input)
    return await data.save();
};

exports.findAll = async (condition = {}) => {
    return await user.find(condition);
};

exports.findById = async (id) => {
    return await user.findById(id);
};

exports.findOne = async (condition) => {
    return await user.findOne(condition);
};

exports.updateOne = async (condition, updatedData, options = {}) => {
    const result = await user.updateOne(condition, updatedData, options);
    return result;
};
