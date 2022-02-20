const url = require("url");
const https = require('https');
//var nuxtconfig = require('./nuxt.config');
const request = require('request');
//const path = require('path');
//const fs = require('fs');
const axios = require("axios");
//const axios = require("axios-https-proxy-fix"); 
//const Cloudworker = require('@dollarshaveclub/cloudworker');
const { URL } = url;
const { verifyJwtToken } = require("./jwt_verify");

// const validReferOrigin = "http://sso.ankuranand.com:3010";
// const ssoServerJWTURL = "http://sso.ankuranand.com:3010/simplesso/verifytoken";
   const validReferOrigin = "https://wowgo.io";
   const ssoServerJWTURL = "https://wowgo.io/simplesso/verifytoken";

      

 const ssoRedirect = () => {  
  return async function(req, res, next) {

    const { ssoToken } = req.query;
    if (ssoToken != null) {
      console.log('token ', ssoToken)
      // to remove the ssoToken in query parameter redirect.
      const redirectURL = url.parse(req.url).pathname;

      console.log('redirect url', redirectURL)

      try {
        const response = await axios.get(
          `${ssoServerJWTURL}?ssoToken=${ssoToken}`,
          {
            headers: {
              Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
            }
          }
        );
        const { token } = response.data;
        const decoded = await verifyJwtToken(token);
        // now that we have the decoded jwt, use the,
        // global-session-id as the session id so that
        // the logout can be implemented with the global session.
        req.session.user = decoded;
        console.log('uuuuuuuuuuuuuu', req.session.user)
      } catch (err) {
        return next(err);
      }

      return res.redirect(`${redirectURL}`);
    }

    return next(); 
  };
};

module.exports = ssoRedirect;

