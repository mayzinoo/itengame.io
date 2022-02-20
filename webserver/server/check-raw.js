const url = require("url");
const https = require('https');
const request = require('request');

const axios = require("axios");
const { URL } = url;
const { verifyJwtToken } = require("./jwt_verify");
const cloudscraper = require('cloudscraper');

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
        const response = await cloudscraper.get(
          `${ssoServerJWTURL}?ssoToken=${ssoToken}`,
          {
            headers: {
              Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
            }  
          }
        );
        //console.log('rrrrrrrrrrrrrrr', response)
        var resultObj = JSON.parse(response);  
        //console.log('tttttttttttttt', resultObj["token"])     
        const token  = resultObj["token"];
        console.log('ttttttttttt', token)
        const decoded = await verifyJwtToken(token);
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
