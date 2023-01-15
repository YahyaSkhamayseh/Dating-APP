'use strict';
const express = require('express');
const Comment = require('../models/comment.model.js');
const {badRequestResponse, internalServerErrorResponse, okResponse} = require('../utils/response.js');

const router = express.Router();

module.exports = function() {

    // create comment 
  router.post('/comment', async (req, res) => {

    if (!req.body || !req.body.comment) {
      badRequestResponse(res, "comment is required");
      return;
    }

    const commentProperties = req.body.comment;
    const comment = await Comment.create(commentProperties);
    okResponse(res, {
        comment: {_id: comment._id,  ...commentProperties}
    });

  });

  // filter comment by personality type and sort by total likes or timestamp
  router.get('/comment', async (req, res) => {

    const filter = req.query.filter.toLowerCase();
    const sort = req.query.sort.toLowerCase();
    const PERSONALITY_TYPES = ["mbti", "enneagram", "zodiac", "all"];
    const SORT_TYPES = ["best", "recent"];

    if (!filter || !PERSONALITY_TYPES.includes(filter) || !sort || !SORT_TYPES.includes(sort)) {
        badRequestResponse(res, "Wrong filter or sort values");
        return; 
    }

    let filterQuery, sortQuery;

    switch(filter){
        case "mbti":
            filterQuery = {"personalityType.MBTI": {"$ne": null }};
            break;
        case "enneagram":
            filterQuery = {"personalityType.Enneagram": {"$ne": null }};
            break;
        case "zodiac":
            filterQuery = {"personalityType.Zodiac": {"$ne": null }};
            break;
        default: 
            filterQuery = {"personalityType" : {"$ne": null }};
    }

    switch(sort){
        case "best":
            sortQuery = {"totalLikes": -1};
            break;
        default: 
            sortQuery = {"createdAt": -1};
    }

    const comments = await Comment.find(filterQuery).sort(sortQuery);
    okResponse(res, comments);

  });

  return router;
}





