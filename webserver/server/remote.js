const url = require("url");
const https = require('https');
var nuxtconfig = require('./nuxt.config');
const request = require('request');
const path = require('path');
const fs = require('fs');
const axios = require("axios");
const Cloudworker = require('@dollarshaveclub/cloudworker');
const { URL } = url;
const { verifyJwtToken } = require("./jwt_verify");

 const validReferOrigin = "http://sso.ankuranand.com:3010";
 const ssoServerJWTURL = "http://sso.ankuranand.com:3010/simplesso/verifytoken";
 
   const superagent = require('superagent');

   const fetch = require("node-fetch");

   //const cloudscraper = require('cloudscraper');
   var requester = require('request');
  var cloudscraper = require('cloudscraper');

exports.getuser = function() {
    const token = 'NJRDr250RvhkX2rKL4yquk2vk90';
    const  ssoToken  = token;
    if (ssoToken != null) {
        console.log('token ', ssoToken)
        // to remove the ssoToken in query parameter redirect.
        
       try {
          const response = cloudscraper.get(
            `${ssoServerJWTURL}?ssoToken=${ssoToken}`,
              {
              headers: {
                Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
              }  
            } 
          );
          console.log('rrrrrrrrrrrrrrr', response)
          var resultObj = JSON.parse(response);  
          //console.log('tttttttttttttt', resultObj["token"])     
          const token  = resultObj["token"];
          console.log('ttttttttttt', token)
          const decoded = verifyJwtToken(token);
          console.log('dddddddddddddd', decoded)
          
          
        } catch (err) {
          console.log('eeeeeeeeeeeeeeeeee', err)
        }
       
         
    }
    return 'ccc';
}

