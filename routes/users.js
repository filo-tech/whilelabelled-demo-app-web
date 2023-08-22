const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
const {response} = require("express");


// TODO - Ensure this request is authenticated to avoid misuse of API
router.get('/filo/token', async function (req, res, next) {
  // Fetch user identifier from headers/cookies/or body
  const userId = req.header('user-id')

  // ===============================================
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
  const token = jwt.sign(filoAuthPayload, process.env.FILO_TOKEN);
  // ----------- end user token generation ----------

  // ========================================
  // Optionally configure user data with filo
  try {
    const filoUserData = await provisionUser(token, 'Rohit Kumar', 10);
    console.log("Filo user data", {uid: filoUserData.userId});
  } catch (e) {
    next(e);
    return;
  }
  // todo - save this user id to your database
  // ----------- end user provisioning ----------

  // ============================================
  // Send token back to client to call the web SDK
  res.send({token: token, expiry: expiry, url: process.env.FILO_APP, partnerId: process.env.FILO_PARTNER_ID});
});

/**
 * @param {*} token
 * @param {number} name - required
 * @param {number} gradeId - required
 * @param {number|null} boardId - optional
 * @param {string|null} gender - male/female - optional
 * @param {string|null} country - optional
 */
const provisionUser = async (token, name, gradeId, boardId = null, gender = null, country = null) => {
  const profileUpdateUrl = `${process.env.FILO_HOST}/vendor/${process.env.FILO_PARTNER_ID}/users`
  const userResp = await fetch(profileUpdateUrl, {
    method: 'POST',
    body: JSON.stringify({
      token, name, gradeId, boardId, gender, country
    }),
    headers: {'Content-Type': 'application/json'}
  });
  if (userResp.status !== 200) {
    console.error('unable to provision user with filo', {status: userResp.status});
    throw new Error('unable to provision user with filo')
  }

  return await userResp.json()
}

module.exports = router;
