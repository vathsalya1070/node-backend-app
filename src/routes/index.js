const express = require('express');
const auth = require("../middleware/auth");
const articleService = require("../service/article");
const userService = require("../service/user");
const likesService = require("../service/likes");
const commentsService = require("../service/comments");
const replyService = require("../service/reply");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose")

// To register a user
router.post("/register", async (req, res) => {
    try { // Get user input
        const {first_name, last_name, email, password} = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await userService.findOne({email});
        console.log("old user ", oldUser)
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await userService.create({
            first_name, last_name, email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword
        });

        // Create token
        const token = jwt.sign({
            user_id: user._id,
            email
        }, process.env.JWT_SECRET, {expiresIn: "2h"});

        const response = JSON.parse(JSON.stringify(user));
        response.token = token; // return new user
        return res.status(200).json(response);
    } catch (err) {
        console.log("User registration failed error :: ", err);
        res.status(400).json({message: "User registration failed"});
    }
});

// To login user
router.post("/login", async (req, res) => {
    try { // Get user input
        const {email, password} = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await userService.findOne({email});

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                user_id: user._id,
                email
            }, process.env.JWT_SECRET, {expiresIn: "2h"});

            // save user token
            const response = JSON.parse(JSON.stringify(user));
            response.token = token;
            // return  user
            return res.status(200).json(response);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log("User login error :: ", err);
    }
});

// To create posts/article
router.post('/article', auth, async (req, res) => {
    try {
        console.log("Create article input :: ", req);
        const insertObj = {
            title: req.body.title,
            user: req.user.user_id
        }
        const result = await articleService.create(insertObj);
        res.status(200).json(result)
    } catch (error) {
        console.log("Error in saving article :: ", error)
        res.status(400).json({message: error.message})
    }
});

// To update the tag for the article
router.put('/article/:id', auth, async (req, res) => {
    try {
        console.log("Adding tag to article input :: ", req);
        const id = req.params.id;
        const updateObject = {
            tag: req.body.tag
        }
        const options = {
            new: true
        }
        const result = await articleService.findByIdAndUpdate(id, updateObject, options);
        res.status(200).json(result)
    } catch (error) {
        console.log("Error in adding tag to article :: ", error)
        res.status(400).json({message: error.message})
    }
});

// To fetch the list of article/posts made by a specific user with comment and like count
router.get('/article', auth, async (req, res) => {
    try {
        console.log("list of articles input :: ", req);
        console.log("user details ", req.user)
        const condition = {};
        const likesCondition = {};
        const commentsCondition = {};

        if (req.query.title) {
            condition.title = req.query.title;
        }

        if (req.query.tag) {
            condition.tag = req.query.tag;
        }
        if (req.query.likes) {
            likesCondition.count = Number(req.query.likes);
            console.log("Likes condition :: ", likesCondition)
        }
        if (req.query.comment) {
            commentsCondition.comment = req.query.comment;
            console.log("Comments condition :: ", commentsCondition)
        }
        console.log("article condition ", condition)
        const result = await articleService.findAll(condition);
        console.log("result from findall ", result)
        const finalResult = [];
        await Promise.all(await result.map(async (rec) => {
            const article = JSON.parse(JSON.stringify(rec));
            likesCondition.article_id = article._id;
            const likeRes = await likesService.findOne(likesCondition);
            article.likes = likeRes ? likeRes.count : 0;
            likesCondition.article_id = article._id;
            commentsCondition.article_id = article._id;
            const commentRes = await commentsService.findAll(commentsCondition);
            article.comments = commentRes;
            if (req.query.likes && likeRes && Object.keys(likeRes).length) {
                finalResult.push(article)
            } else if (req.query.comment && commentRes && Object.keys(commentRes).length) {
                finalResult.push(article)
            } else if (!req.query.likes && !req.query.comment) {
                finalResult.push(article)
            }
        }))
        return res.status(200).json(finalResult)
    } catch (error) {
        console.log("Error in list of articles :: ", error)
        res.status(400).json({message: error.message})
    }
});


// To like a specific article
router.put('/article/like/:id', auth, async (req, res) => {
    try {
        console.log("like a specific article input :: ", req);
        if (req.body.like) {
            const condition = {
                article_id: req.params.id,
                user_id: req.user.user_id
            };
            const updateObject = {
                $inc: {
                    count: 1
                }
            }
            const options = {
                upsert: true
            }
            const result = await likesService.updateOne(condition, updateObject, options);
            res.status(200).json(result)
        } else {
            res.status(400).json({message: "Invalid Input"})
        }
    } catch (error) {
        console.log("Error in like a article :: ", error)
        res.status(400).json({message: error.message})
    }
});

// To comment a specific article
router.put('/article/comment/:id', auth, async (req, res) => {
    try {
        console.log("comment a specific article input :: ", req);
        const insertObj = {
            article_id: req.params.id,
            user_id: req.user.user_id,
            comment: req.body.comment
        };
        const result = await commentsService.create(insertObj);
        res.status(200).json(result)
    } catch (error) {
        console.log("Error in comment a article :: ", error)
        res.status(400).json({message: error.message})
    }
});

// To comment a specific article
router.put('/article/comment/reply/:id', auth, async (req, res) => {
    try {
        console.log("reply a specific article comment input :: ", req);
        const condition = {
            comment_id: req.params.id
        };
        const updateObject = {
            reply: req.body.reply,
            user_id: req.user.user_id,
            article_id: req.body.article_id
        }
        const options = {
            upsert: true
        }

        const result = await replyService.updateOne(condition, updateObject, options);
        res.status(200).json(result)
    } catch (error) {
        console.log("Error in comment a article :: ", error)
        res.status(400).json({message: error.message})
    }
});

// To comment a specific article
router.put('/article/bookmark/:id', auth, async (req, res) => {
    try {
        console.log("Bookmark article  input :: ", req);
        const condition = {
            _id: req.user.user_id
        };
        const updateObject = {
            $addToSet: {
                bookmark_articles: req.params.id
            }
        }
        const options = {
            upsert: true
        }
        const result = await userService.updateOne(condition, updateObject, options);
        res.status(200).json(result)
    } catch (error) {
        console.log("Error in comment a article :: ", error)
        res.status(400).json({message: error.message})
    }
});

// To get list of articles or get specific article with specific user
router.get('/articlesdata', auth, async (req, res) => {

    let user = req.query.user;
    let id = req.query.article_id;
    let matchQuery = {};
    let aggreateQuery = [
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "article_id",
                as: "comments"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "article_id",
                as: "likes"

            }
        },
        {
            $lookup: {
                from: "users",
                localField: "likes.user_id",
                foreignField: "_id",
                as: "likes.users"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.user_id",
                foreignField: "_id",
                as: "users"
            }
        }, {
            $project: {
                "likes.users.password": 0,
                "likes.users.bookmark_articles": 0,
                "likes.users._v": 0,
                "users.password": 0,
                "users._v": 0
            }
        }

    ]

    if (user) {
        matchQuery["user"] = user;
    }
    if (id) {
        matchQuery["_id"] = mongoose.Types.ObjectId(id);
    }
    if (user || id) {
        aggreateQuery.push({$match: matchQuery});
    }
    try {
        let data = await articleService.aggregate(aggreateQuery);
        data = await Promise.all(await data.map((rec) => {
            rec.likes.count = rec.likes ?. users ?. length;
            if (rec.comments.length) {
                console.log(rec.users)
                rec.comments = rec.comments.map((comment) => {
                    const user = rec.users ?. find(o => o._id.equals(comment.user_id));
                    comment.user = user;
                    return comment;
                })
            }
            delete rec.users;
            return rec;
        }));
        console.log("Final response :: ", data);
        return res.send(data);
    } catch (error) {
        console.log("Error in list of articles :: ", error)
        res.status(400).json({message: error.message})
    }
});

// To get user profile data by id
router.get('/user/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.findById(id);
        console.log("User response :: ", user);
        return res.send(user);

    } catch (err) {
        console.log("Error in user profile data :: ".err);
        res.status(400).json({message: err.message})
    }
})

module.exports = router;
