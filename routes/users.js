const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { response } = require("express");
const users = require("./s2s/users");

// TODO - Ensure this request is authenticated to avoid misuse of API
router.get("/filo/token", async function (req, res, next) {
  // Fetch user identifier from headers/cookies/or body
  const userId = req.header("user-id");

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
    const filoUserData = await users.provisionUser(token, "Rohit Kumar", 10);
    console.log("Filo user data", { uid: filoUserData.userId });
    // todo - save this user id to your database
  } catch (e) {
    console.error("unable to provision user: ", e)
    next(e);
    return;
  }
  // ----------- end user provisioning ----------

  // ============================================
  // Send token back to client to call the web SDK
  res.send({
    token: token,
    expiry: expiry,
    url: process.env.FILO_APP,
    partnerId: process.env.FILO_PARTNER_ID,
  });
});

module.exports = router;
