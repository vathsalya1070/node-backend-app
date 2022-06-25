const reply = require('../models/reply');


exports.create = async (input) => {
    const data = new reply(input)
    const result = await data.save();
    return result;
};

exports.findByIdAndUpdate = async (id, updatedData, options = {}) => {
    const result = await reply.findByIdAndUpdate(id, updatedData, options);
    return result;
};


exports.updateOne = async (condition, updatedData, options = {}) => {
    const result = await reply.updateOne(condition, updatedData, options);
    return result;
};

exports.findAll = async (condition = {}) => {
    const result = await reply.find(condition);
    return result;
};
