var admin = require('./admin'); var assert = require('better-assert'); var lib = require('./lib'); var database 
= require('./database'); var user = require('./user'); var games = require('./games'); var sendEmail = 
require('./sendEmail'); var stats = require('./stats'); var config = require('../config/config'); var 
recaptchaValidator = require('recaptcha-validator'); var logics = require('./logics'); var production =
process.env.NODE_ENV === 'production'; var geoip = require('geoip-lite'); var useragent = require('express-useragent');
var express = require('express'); var http = require('http'); const router = express.Router(); var eth_client = require('./eth_client');
var tip = require('./tip'); var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

// For Login Cache 
const morgan = require("morgan");
const session = require("express-session");


const isAuthenticatedlogout = require("./isAuthenticatedlogout");
const isAuthenticated = require("./isAuthenticated");
const checkSSORedirect = require("./checkSSORedirect");
const remote = require("./remote");



function staticPageLogged(page, loggedGoTo) {
    
    return function(req, res) {
        var user = req.user;
        if (!user){
            //console.log(req.query.referral);
            //console.log('req.query.referral');
            if(req.query.referral)
                return res.render(page,{referral:req.query.referral});
            else
            return res.render(page);
        }
        if (loggedGoTo) return res.redirect(loggedGoTo);
        //Add userlogs
        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        const ipInfo = req.ipInfo;
        //var message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country}`;
        
        // var ipAddress = req.ip;
     //    var userAgent = req.get('user-agent');
     //    var ua = req.headers['user-agent'];
     //    //console.log(ua);
     //    if(ipAddress.substr(0,7) == "::ffff:"){
     //            ipAddress = ipAddress.substr(7)
     //    }
     //    console.log(ipAddress);

     //    var login_time = year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
     //    var geo = geoip.lookup(ipAddress);
     //     var location = geo['city'];
     //      var device = req.useragent['browser'];

     //    database.setuserlogs(user.id, login_time, ipAddress,location,device, function(err,logs) {        
     //        console.log(logs);            
     //    });
        //End userlogs
        res.render(page, {
            user: user
        });
    }
}


 
function contact(origin) {
    assert(typeof origin == 'string');
    return function(req, res, next) {
        var user = req.user;
        var from = req.body.email;
        var message = req.body.message;
        if (!from ) return res.render(origin, { user: user, warning: 'email required' });
        if (!message) return res.render(origin, { user: user, warning: 'message required' });
        if (user) message = 'user_id: ' + req.user.id + '\n' + message;
        sendEmail.contact(from, message, null, function(err) {
            if (err)
                return next(new Error('Error sending email: \n' + err ));
            return res.render(origin, { user: user, success: 'Thank you for writing, one of my humans will write you back very soon :)' });
        });
    }
}
function restrict(req, res, next) {
    if (!req.user) {
       res.status(401);
       if (req.header('Accept') === 'text/plain')
          res.send('Not authorized');
       else
          res.render('401');
       return;
    } else
        next();
}
function restrictRedirectToHome(req, res, next) {
    if(!req.user) {
        res.redirect('/');
        return;
    }
    next();
}
function adminRestrict(req, res, next) {
    // if (!req.user || !req.user.admin) {
    //     res.status(401);
    //     if (req.header('Accept') === 'text/plain')
    //         res.send('Not authorized');
    //     else
    //         res.render('401'); //Not authorized page.
    //     return;
    // }
    next();
}
function recaptchaRestrict(req, res, next) {
  var recaptcha = lib.removeNullsAndTrim(req.body['g-recaptcha-response']);
  
  recaptchaValidator.callback(config.RECAPTCHA_PRIV_KEY, recaptcha, req.ip, function(err) {
    if (err) {
      if (typeof err === 'string')
        res.send('Got recaptcha error: ' + err + ' please go back and try again');
      else {
        console.error('[INTERNAL_ERROR] Recaptcha failure: ', err);
        res.render('error');
      }
      return;
    }
    next();
  });
}
function table() {
    return function(req, res) {
        res.render('table_old', {
            user: req.user,
            table: true
        });
    }
}
function tableNew() {
    
    return function(req, res) {
        console.log('ssssssssssssssssssss', req.session.user)
        if(req.session.user !== undefined){
            const username = req.session.user.username;
              //console.log('nnnnnnnnnnnnnnnnnn', username)
              database.getuserid(username, function(err, userId) {
                    if (err) { }
                    //console.log('uuuuuuuuuuuuuuuuuu', userId)
                  database.getsessionbyid(userId, function(err, sessionId) {
                    if (err) { }
                    //console.log('sssssssssssssssssss', sessionId)
                  //Set cookie
                  res.cookie('id', sessionId); 
                  console.log('jjjjjjjjjjjjjj',req.session);
                    res.render('table_new', {
                        user: JSON.stringify(req.session.user),
                        buildConfig: config.BUILD,
                        table: true
                    });
                  
                });
            });                
        }
        else{
            console.log('jjjjjjjjjjjjjj', remote.getuser());
            res.render('table_new', {
                user: JSON.stringify(req.session.user),
                buildConfig: config.BUILD,
                table: true
            });  
        }        
    }
}
function tableDev() {
    return function(req, res) {
        if(config.PRODUCTION)
            return res.status(401);
        requestDevOtt(req.params.id, function(devOtt) {
            res.render('table_new', {
                user: req.user,
                devOtt: devOtt,
                table: true
            });
        });
    }
}
function requestDevOtt(id, callback) {
    var curl = require('curlrequest');
    var options = {
        url: 'https://www.dlkfdsj.com/ott',
        include: true ,
        method: 'POST',
        'cookie': 'id='+id
    };
    var ott=null;
    curl.request(options, function (err, parts) {
        parts = parts.split('\r\n');
        var data = parts.pop()
            , head = parts.pop();
        ott = data.trim();
        console.log('DEV OTT: ', ott);
        callback(ott);
    });
}
module.exports = function(app) {

    //For Login Cache
    app.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true
      })
    );

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(checkSSORedirect());



    //app.get('/', staticPageLogged('index'));
    app.get('/depositreq', user.getdeposit);
    //app.get('/login', staticPageLogged('login', '/play'));

    
    app.get('/register', function(req, res) {      
      return res.render('forreferral');        
    });

    // app.post("/logout", isAuthenticatedlogout, (req, res, next) => {
        
    //     console.log('rrrrrrrrrrrrrrrrrrrrrrrrr')
    //     res.redirect('/'); 
    // }); 
    
    app.get("/deletesession", user.clearsession);  

    app.get('/login', function(req, res) {          
      
      return res.render('login');   
   });  

   app.get('/wrongpassword', function(req, res) {      
      return res.render('wrongpassword');   
   }); 

   app.get('/nouser', function(req, res) {      
      return res.render('nouser');   
   });  

   app.get('/nouserorpass', function(req, res) {      
      return res.render('nouserorpass');   
   }); 

    //For Login Cache
    // app.get("/login", isAuthenticatedlogin, (req, res, next) => {
    //     console.log('sssssssss', req.session)
    //     res.render('table_new', {
    //         user: req.session.user,
    //         //user: JSON.stringify(req.session.user),
    //         buildConfig: config.BUILD,
    //         table: true    
    //   });
    // }); 

   

    // app.get("/", (req, res, next) => {
    //     var current_user = req.session.user;
    //     console.log('current userrrrrr', current_user)
    //     if(current_user === undefined){
    //         res.render("index");
    //     }
    //     else{
    //         res.render("index", {
    //         what: req.session.user 
    //      });
    //     }      
    // });

    
    app.get('/register/:referral', user.contact);
    app.get('/reset/:recoverId', user.validateResetPassword);
    app.get('/faq', staticPageLogged('faq'));
    app.get('/contact', staticPageLogged('contact'));
    app.get('/request', user.request);
    app.get('/support', restrict, user.contact);
    app.get('/account', restrict, user.account);    
    app.get('/referral', restrict, user.referral);
    app.get('/security', restrict, user.security);
    app.get('/forgot-password', staticPageLogged('forgot-password'));
    app.get('/calculator', staticPageLogged('calculator'));
    app.get('/guide', staticPageLogged('guide'));
    app.get('/wallet', restrict, user.wallet);
    app.get('/deposit', restrict, user.deposit);    
    app.get('/withdraw', restrict, user.withdraw);
    app.get('/withdraw/request', restrict, user.withdrawRequest);
    app.get('/tip', restrict, user.tip);
    app.get('/tip-send', restrict, user.tipSend);
    app.get('/play-old', table());
    app.get('/', tableNew());
    app.get('/play', tableNew());    
    app.get('/play-id/:id', tableDev());
    app.get('/leaderboard', games.getLeaderBoard);
    app.get('/game/:id', games.show);
    app.get('/user/:name', user.profile);
    app.get('/withdraw-info/:id', restrict, user.withdrawinfo);   

    app.get('/confirmwithdraw/:id' , user.sendwithdraw );
    app.get('/about', user.about);
    app.get('/fairness', user.fairness);
    app.get('/affiliate', user.referral);
    app.get('/howtoplay', user.howtoplay);
    app.get('/cache', user.cache);
    app.post('/cache', user.cache);

//     app.get("/", isAuthenticated, (req, res, next) => {
//        res.render("table_new", {
//        user: req.user
//     });
// });

    

    app.post('/updateemail', user.editEmail);
    app.post('/edit-info', user.editinfo);

    // app.get('/dashboard' , function(req,res) {
    //     return res.redirect('/admin_dashboard');
    
    // });

    //to call api
    var request = require('request'),
    username = "pp1",
    password = "12345",
    url = "http://wowkong.wowgo.io/api/login",

    auth =  new Buffer(username + ":" + password).toString("base64");
    console.log(auth);

    request(
        {
            url : url,
            // headers : {
            //     "Authorization" : auth
            // },
            data: 'something'
        },
        function (error, response, body) {
            //console.log('sock sock', body)
            // Do more stuff with 'body' here
        }
    );

    // for api
    app.get('/api', function(req,res){
        res.json({
            text: 'my api!'
        });
    });

    app.post('/api/login', function(req, res) {
        const username =  req.body.user;
        const password =  req.body.password;
                
         database.validuserornot(username, password, function(err, userId, userbalance) {
            if (err) {
                res.json({
                    text: 'not valid user or password'
                }); 
            }
            const token = jwt.sign( {user}, 'my_secret_key');
            res.json({
                token: token
            }); 
        });         
    });

    app.get('/api/protected', ensureToken, function(req, res){
         jwt.verify(req.token, 'my_secret_key', function(err,data){
            if(err){
                res.render('error');
            }
            else{
                 res.json({
                     text: 'this is protected',  
                     data: data          
                });
            }
         })             
    });
    

    app.put('/api/updatebalance', ensureToken, function(req, res) {
        jwt.verify(req.token, 'my_secret_key', function(err,data){
            if(err){
                res.render('error');
            }
            else{                 
                 const senderid = req.body.senderid;
                 const receiverid = req.body.receiverid;
                 const balance = parseInt(req.body.balance);

                  if (!req.body.balance) {
                    return res.status(400).send({
                      success: 'false',
                      message: 'balance is required',
                    });
                  } else{}

                  const updatedbalance = {
                    sendername: senderid,
                    receivername: receiverid,
                    balance: balance,
                  };

                  database.checkreceiver(receiverid, function(err) {
                    if (err) {
                            console.log('not found');
                                    return res.status(400).send({
                                    success: 'false',
                                    message: 'receiver user not found',                                    
                                 });    
                        }        
                        else{
                            database.updatememberbalance(senderid,receiverid, balance,  function(err) {
                                if (err) {
                                    console.log('update error', err);     
                                }        
                                else{
                                    console.log('success');
                                    return res.status(201).send({
                                    success: 'true',
                                    message: 'balance updated successfully',
                                    updatedbalance,
                                  });
                                }    
                          });  
                        }    
                  });                   
            }
    })
  });      

    function ensureToken(req,res,next){
        const bearerHeader = req.headers["authorization"];
        if(typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        }
        else{
            res.render('error');
        }
    }  
    
    app.get('/error', function(req, res, next) { // Sometimes we redirect people to /error
      return res.render('error');
    });
    app.post('/depositreq', restrict,user.getdeposit);
    app.post('/request', user.giveawayRequest);
    app.post('/sent-reset', user.resetPasswordRecovery);
    app.post('/sent-recover', recaptchaRestrict, user.sendPasswordRecover);
    app.post('/reset-password', restrict, user.resetPassword);
    app.post('/edit-email', restrict, user.editEmail);
    app.post('/enable-2fa', restrict, user.enableMfa);
    app.post('/disable-2fa', restrict, user.disableMfa);
    app.post('/deposit-request', restrict, user.handleDepositRequest);
    app.post('/new-withdraw-request', restrict, user.handlenewWithdrawRequest);
    app.post('/withdraw-request', restrict, user.handleWithdrawRequest);
    app.post('/cancel-withdraw', restrict, user.cancelWithdraw);
    app.post('/cancel-deposit', restrict, user.cancelDeposit);
    app.post('/tip-send', restrict, user.handleTipSend);    
    app.post('/support', restrict, contact('support'));
    app.post('/contact', contact('contact'));
    app.post('/logout', restrictRedirectToHome, user.logout);
    app.post('/login', user.login);
    app.post('/transfer-referral-amount',user.transferReferralAmount);
    app.post('/register', user.register);
    
    // ott: one-time token
    app.post('/ott', restrict, function(req, res, next) {
        var user = req.user;
        var ipAddress = req.ip;
        var userAgent = req.get('user-agent');
        //assert(user);
        database.createOneTimeToken(user.id, ipAddress, userAgent, function(err, token) {
            if (err) {
                console.error('[INTERNAL_ERROR] unable to get OTT got ' + err);
                res.status(500);
                return res.send('Server internal error');
            }
            res.send(token);
        });
    });

    // get withdraw status

    app.get('/stats', stats.index);
    // Admin stuff
    app.get('/admin/options', adminRestrict, admin.options);
    app.post('/admin/options', adminRestrict, admin.updateOptions);
    app.get('/admin/giveaway', adminRestrict, admin.giveAway);
    app.post('/admin/giveaway', adminRestrict, admin.giveAwayHandle);
    
    app.get('*', function(req, res) {
        res.status(404);
        res.render('404');
    });

    // for bitkong routes
};

