const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')


// TODO - Ensure this request is authenticated to avoid misuse of API
router.get('/filo/token', function (req, res) {
  // Fetch user identifier from headers/cookies/or body
  const userId = req.header('user-id')

  // Create user token to authorise user with filo
  const now = Math.round(Date.now() / 1000);
  const expiry = now + 60 * 60 * 24; // Once token is expired, you will need to regenerate the token
  const filoAuthPayload = {
    iat: now,
    exp: expiry,
    aud: "student.askfilo.com",
    sub: userId,
    scope: process.env.FILO_PARTNER_ID,
  };
  const token = jwt.sign(filoAuthPayload, process.env.FILO_TOKEN)

  // Optionally configure user data with filo

  res.send({token: token, expiry: expiry, url: process.env.FILO_APP, partnerId: process.env.FILO_PARTNER_ID})
});

module.exports = router;
