'use strict';

const express = require('express');
const Profile = require('../models/profile.model.js');
const {notFoundResponse, badRequestResponse, internalServerErrorResponse, okResponse} = require('../utils/response.js');

const router = express.Router();

module.exports = function() {

  router.get('/profile/:id', async function(req, res, next) {

    const id = req.params.id;

    if (id.length != 24) {
      badRequestResponse(res, "invalid profile id");
      return;
    }

    const profile = await Profile.findOne({_id: id});

    if (profile) {
      res.render('profile_template', {
        profile: profile,
      });
    } else {
      notFoundResponse(res);
    }
    
  });

  router.post('/profile', async (req, res) => {

    if (!req.body || !req.body.profile) {
      badRequestResponse(res, "profile is required");
      return;
    }

    const profileToAdd = req.body.profile;
    const profile = await Profile.create(profileToAdd);

    okResponse(res, {
      profile: {_id: profile._id,  ...profileToAdd}
    })
     
  });

  return router;
}

