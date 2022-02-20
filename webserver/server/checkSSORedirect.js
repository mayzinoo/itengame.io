const url = require("url");
const https = require('https');
var nuxtconfig = require('./nuxt.config');
const request = require('request');
const path = require('path');
const fs = require('fs');
const axios = require("axios");
//const axios = require("axios-https-proxy-fix"); 
const Cloudworker = require('@dollarshaveclub/cloudworker');
const { URL } = url;
const { verifyJwtToken } = require("./jwt_verify");

 const validReferOrigin = "http://sso.ankuranand.com:3010";
 const ssoServerJWTURL = "http://sso.ankuranand.com:3010/simplesso/verifytoken";
    // const validReferOrigin = "https://wowgo.io";
    // const ssoServerJWTURL = "https://wowgo.io/simplesso/verifytoken";

   const superagent = require('superagent');

   const fetch = require("node-fetch");

   //const cloudscraper = require('cloudscraper');
   var requester = require('request');
  var cloudscraper = require('cloudscraper');
//   cloudscraper.defaultParams.agentOptions.ciphers += ':!ECDHE+SHA:!AES128-SHA:!AESCCM:!DHE:!ARIA';
//   cloudscraper.defaultParams.agentOptions.sigalgs = 'ECDSA+SHA256';   

//    cloudscraper.defaultParams.headers = {
//   Connection: 'keep-alive',
//   'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
//   Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
//   'Accept-Encoding': 'gzip, deflate',
//   'Accept-Language': 'en-US,en;q=0.9',
//   'X-Requested-With': 'XMLHttpRequest'
// };

//    const headers = Object.assign({}, cloudscraper.defaultParams.headers);
//     const jar = cloudscraper.defaultParams.jar;
//    //cloudscraper.debug = true;
//    const CloudflareBypasser = require('cloudflare-bypasser');

   //cloudscraper.get('https://wowgo.io/').then(console.log, console.error);


   
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
      
      
      // var cloudscraper = require('cloudscraper').defaults({  headers: {
      //         Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
      //        }   });
      
       // cloudscraper.get(`${ssoServerJWTURL}?ssoToken=${ssoToken}`, { headers: { Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
       //       } } , function(error, response, body) {
       //              if (error) {
       //                console.log('Error occurred', error);
       //              } else {
       //                const resdata = body;
       //                var resultObj = JSON.parse(resdata);
       //                var ddd = resultObj["token"];
       //                console.log('ddddddddddddd', ddd)
       //                //console.log('bbbbbbbbbbbbbbbbbb', response);
       //                //console.log(resultObj["token"]);

       //                const  token  = ddd;
       //              const decoded = verifyJwtToken(token);
       //              console.log('decodeddddddddddddd', decoded)
       //              req.session.user = decoded;
       //             console.log('session session', req.session.user)
       //             res.redirect('/');
       //              }
       //            }).then(console.log);
        
      
       // const rrr = cloudscraper.get(`${ssoServerJWTURL}?ssoToken=${ssoToken}`, { headers: { Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
       //       } } , function(error, response, body) {
       //              if (error) {
       //                //console.log('Error occurred');
       //              } else {
       //                const resdata = body;
       //                var resultObj = JSON.parse(resdata);
       //                const ddd = resultObj["token"];                      
       //                //console.log('bbbbbbbbbbbbbbbbbb', response);
       //                //console.log(resultObj["token"]);

       //                const  token  = ddd;
       //                const decoded = verifyJwtToken(token);
       //                //console.log('decodeddddddddddddd', decoded)
                    
       //                req.session.user = decoded;
       //               console.log('session session', req.session.user )
                   
       //              }
       //            });
      
      //res.redirect('/');
      //console.log('rseponseeeeeeeeeeeeeeeee', response)
      

      // got(`https://wowgo.io/simplesso/verifytoken?ssoToken=${ssoToken}`, { headers: {
      //          Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
      //         }  }).then(rre => {
      //   console.log('bbbbbbbbbbbbbbbbbb', rre.body.url);
      //   console.log('eeeeeeeeeeeeeeeee', rre.body.explanation);
      // }).catch(error => {
      //   console.log('rrrrrrrrrrrrrrrrrrr', error);
      // });

      

  //const url2 = `${ssoServerJWTURL}?ssoToken=${ssoToken}`;
  // const url2 = "http://ulungywe.com";

  // const get_data = async url2 => {
  //   try {
  //     const response = await fetch(url2);
  //     //const json = await response.json();
  //     console.log('jjjjjjjjjjjjjjjj', response);
  //   } catch (error) {
  //     console.log('eeeeeeeeeeeeeeeee', error);
  //   }
  // };
  
  // console.log(get_data);
  //get_data(url2);

    

    //const workerScript = fs.readFileSync(path.resolve(__dirname, '../simple-worker.js'), 'utf8');

// const worker = new Cloudworker();
// const server = worker.listen();
// const serverAddress = `${ssoServerJWTURL}?ssoToken=${ssoToken}`;

// const response = await axios.get(serverAddress);

// console.log('rrrrrrrrrrrrrrrrrrrrrppppppppppppp', response)

    //console.log('ssssssssssssssssssssoooooooooooooooooo')
    // check if the req has the queryParameter as ssoToken
    // and who is the referer.
    

      // const proxy = {
      //   host: 'http://sso.ankuranand.com:3010',
      //   port: ''
      // };
      
        // const response = await axios.get(
        //   `${ssoServerJWTURL}?ssoToken=${ssoToken}`,
        //   {
        //     headers: {
        //       Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
        //     }  

        //   }
        // );

        // const rr = await axios.get(`${ssoServerJWTURL}?ssoToken=${ssoToken}`,
        //   {
        //     headers: {
        //       Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
        //     }  

        //   })
        //   .then(response => { 
        //     console.log(response)
        //   })
        //   .catch(error => {
        //       console.log(error.response)
        //   });

      //   try {
      //   const response = await axios.get(
      //     `${ssoServerJWTURL}?ssoToken=${ssoToken}`,
      //     {
      //       headers: {
      //         Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
      //       }
      //     }
      //   );
      //   //resolve(data)
      // } catch (error) {
      //   console.log('eeeeeeeeeeeeeeeeeeee', error) 
      //   //reject(error)
      // }

      // const response = await axios.get(`${ssoServerJWTURL}?ssoToken=${ssoToken}`,
      //     {
      //       headers: {
      //         Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
      //       }           
      //     })
      //   .then(function (response) {
      //          return otpSent(response)
      //   })
      //   .catch(function (error) {
      //         console.log(error);
      //    });

        //console.log('second responseeeeeeeeeeeee', response)
       //  const { token } = response.data;
       //  const decoded = await verifyJwtToken(token);
       //  console.log('decodeddddddddddddd', decoded)
       //  //now that we have the decoded jwt, use the,
       //  //global-session-id as the session id so that
       //  //the logout can be implemented with the global session.
       //  req.session.user = decoded;
       // console.log('session session', req.session.user)
      
       
      
    

    return next();
  };
};

module.exports = ssoRedirect;
