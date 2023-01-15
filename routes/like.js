'use strict';
const express = require('express');
const Comment = require('../models/comment.model.js');
const Like = require('../models/like.model.js');
const UserAccount = require('../models/user-account.model.js');
const {badRequestResponse, okResponse} = require('../utils/response.js');

const router = express.Router();

module.exports = function() {

    // toggle like
    router.post('/toggle-like', async (req, res) => {

        if (!req.body || !req.body.like) {
            badRequestResponse(res, "like is required");
            return;
        }

        const likeProperties = req.body.like;
        
        if (likeProperties.commentId.length != 24 || likeProperties.userAccountId.length != 24) {
            badRequestResponse(res, "invalid comment id or user account id");
            return;
        }

        const comment = await Comment.findOne({
            _id: likeProperties.commentId
        });

        if(!comment) {
            badRequestResponse(res, "comment id not found");
            return;
        }

        const userAccount = await UserAccount.findOne({
            _id: likeProperties.userAccountId
        });

        if(!userAccount) {
            badRequestResponse(res, "user account id not found");
            return;
        }
        
        const like = await Like.findOne({
            userAccountId: likeProperties.userAccountId, 
            commentId: likeProperties.commentId
        });

        let isLiked = false;
        if (!like) {
            await Like.create(likeProperties);
            comment.totalLikes = comment.totalLikes + 1;
            isLiked = true;
        } else {
            await Like.deleteOne(likeProperties);
            comment.totalLikes = comment.totalLikes - 1;
        }

        await comment.save();

        okResponse(res, {
            commentId: comment._id,
            totalLikes: comment.totalLikes,
            isLiked: isLiked
        });
    });

  return router;
}





