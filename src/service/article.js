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


// exports.findWithPopulate = async (articleCondition = {}, likesCondition = {}, commentsCondition = {}) => {
//     const result = await article.findOne(articleCondition).populate({path: "likes", match: likesCondition}).populate({path: "comments", match: commentsCondition});
//     console.log(result)
//     return result;
// };
