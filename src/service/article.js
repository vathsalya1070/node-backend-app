const article = require('../models/article');


exports.create = async (input) => {
    const data = new article(input)
    const result = await data.save();
    return result;
};

exports.findByIdAndUpdate = async (id, updatedData, options = {}) => {
    const result = await article.findByIdAndUpdate(id, updatedData, options);
    return result;
};

exports.findAll = async (condition = {}) => {
    const result = await article.find(condition);
    return result;
};

exports.aggregate = async (input) => {
    const result = await article.aggregate(input);
    return result;
};

