'use strict';
const express = require('express');
const UserAccount = require('../models/user-account.model.js');
const {badRequestResponse, internalServerErrorResponse, okResponse} = require('../utils/response.js');

const router = express.Router();

module.exports = function() {

  router.post('/user-account', async (req, res) => {

    if (!req.body || !req.body.userAccount) {
      badRequestResponse(res, "user account is required");
      return;
    }

    const userAccountProperties = req.body.userAccount;
    const userAccount = await UserAccount.create(userAccountProperties);
  
    okResponse(res, {
      userAccount: {_id: userAccount._id,  ...userAccountProperties}
    });

  });

  return router;
}





