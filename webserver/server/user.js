var assert = require('better-assert');
var express = require('express');
var app = express();
var async = require('async');
var web3 = require('web3');
var request = require('request');
var timeago = require('timeago');
var lib = require('./lib');
var database = require('./database');
var withdraw = require('./withdraw');
var tip = require('./tip');
var depositrequest = require('./depositrequest');
var depositrequesteth = require('./depositrequesteth');
var withdrawrequest = require('./withdrawrequest');
var sendEmail = require('./sendEmail');
var speakeasy = require('speakeasy');
var qr = require('qr-image');
var uuid = require('uuid');
var _ = require('lodash');
var config = require('../config/config');
var eth_client = require('./eth_client');
var fs = require('fs');
var geoip = require('geoip-lite');
var user_aa = require('express-useragent');
var DeviceDetector = require("device-detector-js");
//const bcrypt = require('bcrypt');
const crypto = require('crypto');
//var LocalStorage = require('node-localstorage').LocalStorage;
//localStorage = new LocalStorage('./scratch');
const session = require("express-session");

const isAuthenticated = require("./isAuthenticated");
const checkSSORedirect = require("./checkSSORedirect");
const axios = require("axios");


/**
 * POST
 * Public API
 * Register a user
 */
exports.register  = function(req, res, next) {
    var values = _.merge(req.body, { user: {} });
    var recaptcha = lib.removeNullsAndTrim(req.body['g-recaptcha-response']);
    var username = lib.removeNullsAndTrim(req.body.username);
    var password = lib.removeNullsAndTrim(req.body.password);
    var password2 = lib.removeNullsAndTrim(req.body.confirm);
    var email = lib.removeNullsAndTrim(req.body.email);
    var ipAddress = req.ip;
    var userAgent = req.get('user-agent');
    var referral = null;
    
    if(req.body.referral_code){
        referral = req.body.referral_code;
    }
    var notValid = lib.isInvalidUsername(username);
    if (notValid) res.redirect('/#namewarning'); 

    // stop new registrations of >16 char usernames
    if (username.length > 16)
        return res.redirect('/#namelengthwarning');

    notValid = lib.isInvalidPassword(password);
    if (notValid) {
        values.user.password = null;
        values.user.confirm = null;
        return res.redirect('/#passwordwarning');
    }

    // if (email) {
    //     notValid = lib.isInvalidEmail(email);
    //     if (notValid) return res.render('register', { warning: 'email not valid because: ' + notValid, values: values.user });
    // }

    // Ensure password and confirmation match
    if (password !== password2) {
        return res.redirect('/#donotmatchwarning');
    }

    database.createUser(username, password, email, ipAddress, userAgent, function(err, sessionId,userId) {
        if (err) {
            if (err === 'USERNAME_TAKEN') {
                values.user.name = null;
                return res.redirect('/#alreadytakenwarning');
            }
            return next(new Error('Unable to register user: \n' + err));
        }
        if(referral){
            console.log(username,referral);
            console.log("referral found");
            console.log(values);
            database.addReferral(username ,referral,function(err){
                res.cookie('id', sessionId, sessionOptions);
                return res.redirect('/play?m=new');    
            });
        }else{
            res.cookie('id', sessionId, sessionOptions);
            return res.redirect('/');
        }
    });
};

/**
 * POST
 * Public API
 * Login a user
 */
exports.login = function(req, res, next) {
    var username = lib.removeNullsAndTrim(req.body.username);
    var password = lib.removeNullsAndTrim(req.body.password);
    var otp = lib.removeNullsAndTrim(req.body.otp); // OTP: One-time password
    var remember = !!req.body.remember;
    var ipAddress = req.ip;
    var userAgent = req.get('user-agent');

    var person = {
                  isHuman: false,
                  printIntroduction: function () {
                    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
                  }
                };
                    
    var usr = Object.create(person);

    if (!username || !password)        
        res.redirect('/nouser');

    database.validateUser(username, password, otp, function(err, userId, userbalance) {
        if (err) {
            console.log('[Login] Error for ', username, ' err: ', err);
            if (err === 'NO_USER')
                return res.redirect('/nouserorpass');
            if (err === 'USER_IS_BLOCKED')
                return res.redirect('/#userisblocked');
            if (err === 'WRONG_PASSWORD')
                return res.redirect('/wrongpassword');
            if (err === 'INVALID_OTP') {
                var warning = otp ? 'Invalid one-time password' : undefined;
                return res.redirect('/#login-mfa', { username: username, password: password, warning: warning });
            }
            return next(new Error('Unable to validate user ' + username + ': \n' + err));
        }

        assert(userId);        

        database.createSession(userId, ipAddress, userAgent, remember, function(err, sessionId, expires) {
            if (err)
                return next(new Error('Unable to create session for userid ' + userId +  ':\n' + err));

            if(remember)
                sessionOptions.expires = expires;
		   console.log('CookieId',sessionId);       
        
            res.cookie('id', sessionId); 
           //localStorage.setItem('myFirstKey', sessionId);
            //console.log(localStorage.getItem('myFirstKey'));         
            //res.json({my_token: 'asdfgh-anything-jw-token-qwerty'});                   
            //res.redirect('/?id=' + userId + '&name=' + username + '&balance='+ userbalance); 
            res.redirect('/');
        });        


        var ip = req.ip;
        //var ip = "207.97.227.239";
        var geo = geoip.lookup(ip);
        var location = 'forlocal';
        //var location = geo['city'];
        const deviceDetector = new DeviceDetector();
        const device = deviceDetector.parse(userAgent);
        var dev_name = device['client']['name'];
        //console.log('Divice',device['client']['name']);
        //console.log('user Agent', userAgent);
        //console.log('LOCATION',location);
        database.setuserlogs(userId, ipAddress, location, dev_name, function(err, logId) {

            if (err)
                return next(new Error('Unable to add logs '+ err));            
        });  
    });

};

/**
 * POST
 * Logged API
 * Logout the current user
 */

const ssoRedirect = () => {
  return async function(req, res, next) {
    console.log('delete delete ddddddddddddddddddddddddddddd')
    // check if the req has the queryParameter as ssoToken
    // and who is the referer.
    
        const response = await axios.get(
          'http://sso.ankuranand.com:3010/simplesso/deletesession',
          {
            headers: {
              Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
            }
          }
        );
        const { token } = response.data;
        //const decoded = await verifyJwtToken(token);
        // now that we have the decoded jwt, use the,
        // global-session-id as the session id so that
        // the logout can be implemented with the global session.
        //req.session.user = null;
        
        console.log('session session', token)
        
    return next();
  };
};

exports.cache = function(req, res) {
    console.log('cacheeeeeeeeeeeeeeee')
    res.render('cache');
};

exports.clearsession = function(req, res) {
    console.log('hereeeeeeeeeeeeeeeeeeeeeeeeee');
    delete req.session.user;
    res.clearCookie('id');
    return res.redirect('http://sso.ankuranand.com:3010/');
    //eturn res.redirect('https://wowgo.io/');
};

exports.logout = function(req, res, next) {

    var sessionId = req.cookies.id;
    var userId = req.user.id;

    assert(sessionId && userId);    

    database.expireSessionsByUserId(userId, function(err) {
        if (err)
            return next(new Error('Unable to logout got error: \n' + err));
        
    });
    

    //Remove global session
        
    const response = axios.get(
      `http://sso.ankuranand.com:3010/deletesession?userid=${userId}`,
      {
          headers: {
              Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
            }
      }
    );
    // console.log('calllllllllll', response)
     //req.cookies.id  = '';
     
  //    req.session.destroy(function(err){
  //    if(err){
  //       console.log(err);
  //    }else{
  //        console.log('not errorrrrrrrrrrrrrrrrrr in user.jssssssssssssss');
  //        //req.end();
         
  //    }
  // });   
    
    //console.log('session session ssssssssssss', req.session)
    return res.redirect('/account');
    
};

/**
 * POST
 * About API
 * Show About 
 */
exports.about = function(req, res) {
    res.render('about');
};

/**
 * POST
 * Fairness API
 * Show Fairness 
 */
exports.fairness = function(req, res) {
    var user = req.user; //Login var
    // assert(user);
    res.render('fairness',{user:user});
};

/**
 * POST
 * Affiliate API
 * Show Fairness 
 */
exports.affiliate = function(req, res) {
    var user = req.user;
    res.render('affiliate',{user:user});
};

/**
 * POST
 * Affiliate API
 * Show Fairness 
 */
exports.howtoplay = function(req, res) {
    var user = req.user; //Login var
    // assert(user);
    res.render('howtoplay',{user:user});
};


/**
 * GET
 * Logged API
 * Shows the graph of the user profit and games
 */
exports.profile = function(req, res, next) {

    var user = req.user; //If logged here is the user info
    var username = lib.removeNullsAndTrim(req.params.name);

    var page = null;
    if (req.query.p) { //The page requested or last
        page = parseInt(req.query.p);
        if (!Number.isFinite(page) || page < 0)
            return next('Invalid page');
    }

    if (!username)
        return next('No username in profile');

    database.getPublicStats(username, function(err, stats) {
        if (err) {
            if (err === 'USER_DOES_NOT_EXIST')
               return next('User does not exist');
            else
                return next(new Error('Cant get public stats: \n' + err));
        }

        /**
         * Pagination
         * If the page number is undefined it shows the last page
         * If the page number is given it shows that page
         * It starts counting from zero
         */

        var resultsPerPage = 50;
        var pages = Math.floor(stats.games_played / resultsPerPage);

        if (page && page >= pages)
            return next('User does not have page ', page);

        // first page absorbs all overflow
        var firstPageResultCount = stats.games_played - ((pages-1) * resultsPerPage);

        var showing = page ? resultsPerPage : firstPageResultCount;
        var offset = page ? (firstPageResultCount + ((pages - page - 1) * resultsPerPage)) : 0 ;

        if (offset > 100000) {
          return next('Sorry we can\'t show games that far back :( ');
        }

        var tasks = [
            function(callback) {
                database.getUserNetProfitLast(stats.user_id, showing + offset, callback);
            },
            function(callback) {
                database.getUserPlays(stats.user_id, showing, offset, callback);
            }
        ];


        async.parallel(tasks, function(err, results) {
            if (err) return next(new Error('Error getting user profit: \n' + err));

            var lastProfit = results[0];

            var netProfitOffset = stats.net_profit - lastProfit;
            var plays = results[1];


            if (!lib.isInt(netProfitOffset))
                return next(new Error('Internal profit calc error: ' + username + ' does not have an integer net profit offset'));

            assert(plays);

            plays.forEach(function(play) {
                play.timeago = timeago(play.created);
            });

            var previousPage;
            if (pages > 1) {
                if (page && page >= 2)
                    previousPage = '?p=' + (page - 1);
                else if (!page)
                    previousPage = '?p=' + (pages - 1);
            }

            var nextPage;
            if (pages > 1) {
                if (page && page < (pages-1))
                    nextPage ='?p=' + (page + 1);
                else if (page && page == pages-1)
                    nextPage = stats.username;
            }

            res.render('user', {
                user: user,
                stats: stats,
                plays: plays,
                net_profit_offset: netProfitOffset,
                showing_last: !!page,
                previous_page: previousPage,
                next_page: nextPage,
                games_from: stats.games_played-(offset + showing - 1),
                games_to: stats.games_played-offset,
                pages: {
                    current: page == 0 ? 1 : page + 1 ,
                    total: Math.ceil(stats.games_played / 100)
                }
            });
        });

    });
};

/**
 * GET
 * Shows the request bits page
 * Restricted API to logged users
 **/
exports.request = function(req, res) {
    var user = req.user; //Login var
    assert(user);


    res.render('request', { user: user });
};

/**
 * POST
 * Process the give away requests
 * Restricted API to logged users
 **/
exports.giveawayRequest = function(req, res, next) {
    var user = req.user;
    assert(user);

    database.addGiveaway(user.id, function(err) {
        if (err) {
            if (err.message === 'NOT_ELIGIBLE') {
                return res.render('request', { user: user, warning: 'You have to wait ' + err.time + ' minutes for your next give away.' });
            } else if(err === 'USER_DOES_NOT_EXIST') {
                return res.render('error', { error: 'User does not exist.' });
            }

            return next(new Error('Unable to add giveaway: \n' + err));
        }
        user.eligible = 240;
        user.balance += 200;
        return res.redirect('/play?m=received');
    });

};

/**
 * GET
 * Restricted API
 * Shows the account page, the default account page.
 **/
 exports.getdeposit = function(req, res, next) {
    var user = req.user;
     //Get Ethereum Deposit Address
    // user.deposit_address = lib.deriveAddress(user.id);  

    try {
            let jsondata = JSON.parse(fs.readFileSync('eth_dummy_address.json'));
        } catch (err) {
            console.error(err);
        }     

    let jsondata = fs.readFileSync('eth_dummy_address.json');
    var string = JSON.stringify('eth_dummy_address.json');

    let dep_address = JSON.parse(jsondata);
    console.log("sdfasf");
    var first_address  = dep_address.address[0]['Address'];
    console.log(first_address);
    user.deposit_address = first_address;
    console.log('USER DEPOSIT ADDRESS', user.deposit_address); 

    var removeaddress = first_address; 
    
    var json = JSON.parse(jsondata);
    var address = json.address;
    json.address = address.filter((user) => { return user.Address !== removeaddress });
    fs.writeFileSync('eth_dummy_address.json', JSON.stringify(json, null, 2)); 

    res.render('depositpg',{user:user});
}
exports.account = function(req, res, next) {
    var user = req.user;
    var tamount;
    assert(user);

    var tasks = [
        function(callback) {
            database.getDepositsAmount(user.id, callback);
        },
        function(callback) {
            database.getWithdrawalsAmount(user.id, callback);
        },
        function(callback) {
            database.getGiveAwaysAmount(user.id, callback);
        },
        function(callback) {
            database.getUserNetProfit(user.id, callback)
        }
    ];

    async.parallel(tasks, function(err, ret) {
        if (err)
            return next(new Error('Unable to get account info: \n' + err));

        var deposits = ret[0];
        var withdrawals = ret[1];
        console.log('withdrawals');
        console.log(withdrawals);
        var giveaways = ret[2];
        var net = ret[3];
        let depositsSum = 0;
        let withdrawlsSum = 0;

        //console.log(deposits);
        deposits.map((v) => {
            depositsSum = depositsSum + v.amount;
        })
        withdrawals.map((v) => {
            withdrawlsSum = withdrawlsSum + v.amount*-1;
        })
        user.deposits = deposits;
        user.depositsSum = depositsSum;
        user.withdrawlsSum = withdrawlsSum;

        
        //user.withdrawals = !withdrawals.sum ? 0 : withdrawals.sum;
        user.withdrawals = withdrawals;
        user.giveaways = !giveaways.sum ? 0 : giveaways.sum;
        user.net_profit = net.profit;
        
        //Get Ethereum Deposit Address
        user.deposit_address = lib.deriveAddress(user.id);       

        let jsondata = fs.readFileSync('eth_dummy_address.json');
        var string = JSON.stringify('eth_dummy_address.json');

        let dep_address = JSON.parse(jsondata);
        //console.log(dep_address);
        //var first_address  = dep_address.address[0]['Address'];
        var first_address  = '0x29389DDD356e31E2f290162Cbe96c6bD8dEC5Ae4';
        console.log(first_address);
        user.deposit_address = first_address;
        console.log('USER DEPOSIT ADDRESS', user.deposit_address);

        var removeaddress = first_address;
        var json = JSON.parse(jsondata);
        var address = json.address;
        json.address = address.filter((user) => { return user.Address !== removeaddress });
        fs.writeFileSync('eth_dummy_address.json', JSON.stringify(json, null, 2)); 

        //End Ethereum Deposit Address    

        database.getitenrate(function(err, rate) {         
            user.itenrate = rate;         
        });   
        
            
        /* Start get bankinfo */          
        database.getBankinfousd(function(err, bankinfousd) {             
            user.bankinfousd = bankinfousd;                   
            
        });
        database.getBankinfokrw(function(err, bankinfokrw) {        
            user.bankinfokrw = bankinfokrw;         
            
        });  
        database.getBankinfovnd(function(err, bankinfovnd) {        
            user.bankinfovnd = bankinfovnd;           
            
        });
        
        //console.log('USER',user.bankinfousd['acctowner']);               
        /* End get bankinfo */        
       
        /* Start get tips */          
        database.getTips(user.id, function(err, tips) {
        
            user.tips = tips;
            res.render('account', { user: user, id: uuid.v4() });            
        });          
        /* End get tips */         

    //console.log(user);        
    //res.render('account', { user: user });
    });
};


/**
 * GET
 * Restricted API
 * Shows the referral page, the default account page.
 **/
exports.referral = function(req, res, next) {
    var user = req.user;
    var tamount;
    //console.log(user);
    //console.log('user');
    // assert(user);

    var tasks = [
        function(callback) {
            database.getReferralDetails(user.id, callback);
        },
        function(callback) {
            database.getReferralEarnedAmount(user.id, callback);
        },
        function(callback) {
            database.getReferralWithdrawls(user.id, callback);
        }
    ];

    async.parallel(tasks, function(err, ret) {
        if (err)
            return next(new Error('Unable to get account info: \n' + err));

        var referred = ret[0];
        let totalAmtEarned = 0;
        let earnedReferred = ret[1];
        let final = referred.map((v1)=>{
            let filterred=earnedReferred.filter((v)=>{return v.user_username == v1.user_id;});
            if(filterred.length>0){
                let totalEarned = 0;
                for(let i=0;i<filterred.length;i++){
                    totalEarned=totalEarned+(+filterred[i]['amount']);
                    totalAmtEarned=totalAmtEarned+(+filterred[i]['amount']);
                }
                v1.earned = totalEarned.toFixed(2);
            }else{
                v1.earned = 0;
            }
            return  v1;
        });
        let referralWithdrawls = ret[2];
        let totalreferralWithdrawls = 0;
        for(let i=0;i<referralWithdrawls.length;i++){
           totalreferralWithdrawls = totalreferralWithdrawls + (+referralWithdrawls[i]['amount_transferred']);
        }

        user.referred = final;
        user.referralWithdrawls = ret[2];
        user.totalAmtEarned = totalAmtEarned.toFixed(2);
        user.totalreferralWithdrawls = totalreferralWithdrawls.toFixed(2);
        user.totalreferralavailable = totalAmtEarned - totalreferralWithdrawls;
        user.totalreferralavailable = user.totalreferralavailable.toFixed(2);
        res.render('affiliate', { user: user });         
    });
};


/**
 * GET
 * Restricted API
 * Shows the wallet page, the default wallet page.
 **/
exports.wallet = function(req, res, next) {
    var user = req.user;
    assert(user);

    var tasks = [
        function(callback) {
            database.getDepositsAmount(user.id, callback);
        },
        function(callback) {
            database.getWithdrawalsAmount(user.id, callback);
        },
        function(callback) {
            database.getGiveAwaysAmount(user.id, callback);
        },
        function(callback) {
            database.getUserNetProfit(user.id, callback)
        }
    ];

    async.parallel(tasks, function(err, ret) {
        if (err)
            return next(new Error('Unable to get account info: \n' + err));

        var deposits = ret[0];
        var withdrawals = ret[1];
        var giveaways = ret[2];
        var net = ret[3];
        user.deposits = !deposits.sum ? 0 : deposits.sum;
        user.withdrawals = !withdrawals.sum ? 0 : withdrawals.sum;
        user.giveaways = !giveaways.sum ? 0 : giveaways.sum;
        user.net_profit = net.profit;
        user.deposit_address = lib.deriveAddress(user.id);

        res.render('wallet', { user: user });
    });
};

/**
 * POST
 * Restricted API
 * Referral amount transfer
 **/
exports.transferReferralAmount = function(req, res, next) {
    let amount = req.body.amount_transfer;
    let maxAmount = req.body.available;
    let user= req.user;
    console.log("AMount to be transferred", amount);
    database.transferAmount(user.id,amount,user.username,maxAmount, function(err,result){
        return res.redirect('/referral');
    });
}
/**
 * POST
 * Restricted API
 * Change the user's password
 **/
exports.resetPassword = function(req, res, next) {
    var user = req.user;
    assert(user);
    if(req.body.old_password =='' || req.body.password =='' || req.body.confirmation){
        return  res.redirect('/account/#input-warning');
    }
    else{
       var password = lib.removeNullsAndTrim(req.body.old_password);
    var newPassword = lib.removeNullsAndTrim(req.body.password);
    var otp = lib.removeNullsAndTrim(req.body.otp);
    var confirm = lib.removeNullsAndTrim(req.body.confirmation);
    var ipAddress = req.ip;
    var userAgent = req.get('user-agent');

    if (!password) return  res.redirect('/account/#old-pass-error');

    var notValid = lib.isInvalidPassword(newPassword);
    if (notValid) return res.redirect('/account/#new-pass-error');

    if (newPassword !== confirm) return  res.redirect('/account/#same-error');

    database.validateUser(user.username, password, otp, function(err, userId) {
        if (err) {
            if (err  === 'WRONG_PASSWORD') return  res.redirect('/account/#wrong-password');
            // if (err === 'INVALID_OTP') return res.redirect('/security?err=invalid one-time password.');
            //Should be an user here
            //return next(new Error('Unable to reset password: \n' + err));
        }
        assert(userId === user.id);
        database.changeUserPassword(user.id, newPassword, function(err) {
            if (err)
                return res.redirect('/account/#change-error');

            database.expireSessionsByUserId(user.id, function(err) {
                if (err)
                    return res.redirect('/account/#change-error');

                database.createSession(user.id, ipAddress, userAgent, false, function(err, sessionId) {
                    if (err)
                        return res.redirect('/account/#change-error');

                    //res.cookie('id', sessionId, sessionOptions);
                    res.redirect('/account/#change-success');
                });
            });
        });
    }); 
    }
    
};


/**
 * POST
 * Restricted API
 * Adds an email to the account
 **/
exports.editEmail = function(req, res, next) {
    var user  = req.user;
    assert(user);

    var email = lib.removeNullsAndTrim(req.name);
    console.log('EMAIL', email);

    res.redirect('/');

    // var email = lib.removeNullsAndTrim(req.body.email);
    // var password = lib.removeNullsAndTrim(req.body.password);
    // var otp = lib.removeNullsAndTrim(req.body.otp);

    // //If no email set to null
    // if(email.length === 0) {
    //     email = null;
    // } else {
    //     var notValid = lib.isInvalidEmail(email);
    //     if (notValid) return res.redirect('/security?err=email invalid because: ' + notValid);
    // }

    // notValid = lib.isInvalidPassword(password);
    // if (notValid) return res.render('/security?err=password not valid because: ' + notValid);

    // database.validateUser(user.username, password, otp, function(err, userId) {
    //     if (err) {
    //         if (err === 'WRONG_PASSWORD') return res.redirect('/security?err=wrong%20password');
    //         if (err === 'INVALID_OTP') return res.redirect('/security?err=invalid%20one-time%20password');
    //         //Should be an user here
    //         return next(new Error('Unable to validate user adding email: \n' + err));
    //     }

    //     database.updateEmail(userId, email, function(err) {
    //         if (err)
    //             return next(new Error('Unable to update email: \n' + err));

    //         res.redirect('account?m=Email added');
    //     });
    // });
};

/**
 * GET
 * Restricted API
 * Shows the security page of the users account
 **/
exports.security = function(req, res) {
    var user = req.user;
    assert(user);

    if (!user.mfa_secret) {
        user.mfa_potential_secret = speakeasy.generate_key({ length: 32 }).base32;
        var qrUri = 'otpauth://totp/bustabit:' + user.username + '?secret=' + user.mfa_potential_secret + '&issuer=bustabit';
        user.qr_svg = qr.imageSync(qrUri, { type: 'svg' });
        user.sig = lib.sign(user.username + '|' + user.mfa_potential_secret);
    }

    res.render('security', { user: user });
};

/**
 * POST
 * Restricted API
 * Enables the two factor authentication
 **/
exports.enableMfa = function(req, res, next) {
    var user = req.user;
    assert(user);

    var otp = lib.removeNullsAndTrim(req.body.otp);
    var sig = lib.removeNullsAndTrim(req.body.sig);
    var secret = lib.removeNullsAndTrim(req.body.mfa_potential_secret);

    if (user.mfa_secret) return res.redirect('/security?err=2FA%20is%20already%20enabled');
    if (!otp) return next('Missing otp in enabling mfa');
    if (!sig) return next('Missing sig in enabling mfa');
    if (!secret) return next('Missing secret in enabling mfa');

    if (!lib.validateSignature(user.username + '|' + secret, sig))
        return next('Could not validate sig');

    var expected = speakeasy.totp({ key: secret, encoding: 'base32' });

    if (otp !== expected) {
        user.mfa_potential_secret = secret;
        var qrUri = 'otpauth://totp/bustabit:' + user.username + '?secret=' + secret + '&issuer=bustabit';
        user.qr_svg = qr.imageSync(qrUri, {type: 'svg'});
        user.sig = sig;

        return res.render('security', { user: user, warning: 'Invalid 2FA token' });
    }

    database.updateMfa(user.id, secret, function(err) {
        if (err) return next(new Error('Unable to update 2FA status: \n' + err));
        res.redirect('/security?=m=Two-Factor%20Authentication%20Enabled');
    });
};

/**
 * POST
 * Restricted API
 * Disables the two factor authentication
 **/
exports.disableMfa = function(req, res, next) {
    var user = req.user;
    assert(user);

    var secret = lib.removeNullsAndTrim(user.mfa_secret);
    var otp = lib.removeNullsAndTrim(req.body.otp);

    if (!secret) return res.redirect('/security?err=Did%20not%20sent%20mfa%20secret');
    if (!user.mfa_secret) return res.redirect('/security?err=2FA%20is%20not%20enabled');
    if (!otp) return res.redirect('/security?err=No%20OTP');

    var expected = speakeasy.totp({ key: secret, encoding: 'base32' });

    if (otp !== expected)
        return res.redirect('/security?err=invalid%20one-time%20password');

    database.updateMfa(user.id, null, function(err) {
        if (err) return next(new Error('Error updating Mfa: \n' + err));

        res.redirect('/security?=m=Two-Factor%20Authentication%20Disabled');
    });
};

/**
 * POST
 * Public API
 * Send password recovery to an user if possible
 **/
exports.sendPasswordRecover = function(req, res, next) {
    var email = lib.removeNullsAndTrim(req.body.email);
    if (!email) return res.redirect('forgot-password');
    var remoteIpAddress = req.ip;

    //We don't want to leak if the email has users, so we send this message even if there are no users from that email
    var messageSent = { success: 'We\'ve sent an email to you if there is a recovery email.' };

    database.getUsersFromEmail(email, function(err, users) {
        if(err) {
            if(err === 'NO_USERS')
                return res.render('forgot-password', messageSent);
            else
                return next(new Error('Unable to get users by email ' + email +  ': \n' + err));
        }

        var recoveryList = []; //An array of pairs [username, recoveryId]
        async.each(users, function(user, callback) {

            database.addRecoverId(user.id, remoteIpAddress, function(err, recoveryId) {
                if(err)
                    return callback(err);

                recoveryList.push([user.username, recoveryId]);
                callback(); //async success
            })

        }, function(err) {
            if(err)
                return next(new Error('Unable to add recovery id :\n' + err));

            sendEmail.passwordReset(email, recoveryList, function(err) {
                if(err)
                    return next(new Error('Unable to send password email: \n' + err));

                return res.render('forgot-password',  messageSent);
            });
        });

    });
};

/**
 * GET
 * Public API
 * Validate if the reset id is valid or is has not being uses, does not alters the recovery state
 * Renders the change password
 **/
exports.validateResetPassword = function(req, res, next) {
    var recoverId = req.params.recoverId;
    if (!recoverId || !lib.isUUIDv4(recoverId))
        return next('Invalid recovery id');

    database.getUserByValidRecoverId(recoverId, function(err, user) {
        if (err) {
            if (err === 'NOT_VALID_RECOVER_ID')
                return next('Invalid recovery id');
            return next(new Error('Unable to get user by recover id ' + recoverId + '\n' + err));
        }
        res.render('reset-password', { user: user, recoverId: recoverId });
    });
};

/**
 * POST
 * Public API
 * Receives the new password for the recovery and change it
 **/
exports.editinfo = function(req, res, next) {
    var uname = req.body.uname;
    var uemail = req.body.uemail;
    var userId = req.body.userId;

    //console.log(uname, uemail, userId);

    database.editinfo(uname, uemail, userId, function(err, user) {
        if (err) {
            if (err === 'NOT_VALID_RECOVER_ID')
                return next('Invalid recovery id');
            return next(new Error('Unable to change password for recoverId ' + recoverId + ', password: ' + password + '\n' + err));
        }        
    });
    res.redirect('/');
};

/**
 * POST
 * Public API
 * Receives the new password for the recovery and change it
 **/
exports.resetPasswordRecovery = function(req, res, next) {
    var recoverId = req.body.recover_id;
    var password = lib.removeNullsAndTrim(req.body.password);
    var ipAddress = req.ip;
    var userAgent = req.get('user-agent');

    if (!recoverId || !lib.isUUIDv4(recoverId)) return next('Invalid recovery id');

    var notValid = lib.isInvalidPassword(password);
    if (notValid) return res.render('reset-password', { recoverId: recoverId, warning: 'password not valid because: ' + notValid });

    database.changePasswordFromRecoverId(recoverId, password, function(err, user) {
        if (err) {
            if (err === 'NOT_VALID_RECOVER_ID')
                return next('Invalid recovery id');
            return next(new Error('Unable to change password for recoverId ' + recoverId + ', password: ' + password + '\n' + err));
        }
        database.createSession(user.id, ipAddress, userAgent, false, function(err, sessionId) {
            if (err)
                return next(new Error('Unable to create session for password from recover id: \n' + err));

            res.cookie('id', sessionId, sessionOptions);
            res.redirect('/');
        });
    });
};

/**
 * GET
 * Restricted API
 * Shows the deposit history
 **/
exports.deposit = function(req, res, next) {
    var user = req.user;
    assert(user);

    database.getDeposits(user.id, function(err, deposits) {
        if (err) {
            return next(new Error('Unable to get deposits: \n' + err));
        }
        user.deposits = deposits;
        user.deposit_address = lib.deriveAddress(user.id);
        res.render('deposit', { user:  user });
    });
};

/**
 * GET
 * Restricted API
 * Shows the withdrawal history
 **/
exports.withdraw = function(req, res, next) {    
    var user = req.user;
    assert(user);

    database.getWithdrawals(user.id, function(err, withdrawals) {
        if (err)
            return next(new Error('Unable to get withdrawals: \n' + err));

        withdrawals.forEach(function(withdrawal) {
            withdrawal.shortDestination = withdrawal.destination.substring(0,8);
        });
        user.withdrawals = withdrawals;                
        res.render('withdraw', { user: user, id: uuid.v4() });
    });
};

/**
 * POST
 * Restricted API
 * Process a withdrawal
 **/
exports.handleWithdrawRequest = function(req, res, next) {
    var user = req.user;
    assert(user);

    var amount = req.body.amount;
    var destination = req.body.destination;
    var withdrawalId = req.body.withdrawal_id;
    var password = lib.removeNullsAndTrim(req.body.password);
    var otp = lib.removeNullsAndTrim(req.body.otp);

   

    var r =  /^[1-9]\d*(\.\d{0,2})?$/;
    if (!r.test(amount))
        return res.render('withdraw-request', { user: user, id: uuid.v4(),  warning: 'Not a valid amount' });

    amount = Math.floor(parseFloat(amount));
    assert(Number.isFinite(amount));

    var minWithdraw = config.MIN_WITHDRAW;

    if (amount < minWithdraw)
        return res.render('withdraw-request', { user: user,  id: uuid.v4(), warning: 'You must withdraw ' + minWithdraw + ' or more'  });

    if (typeof destination !== 'string')
        return res.render('withdraw-request', { user: user,  id: uuid.v4(), warning: 'Destination address not provided' });


    var isValidAddress = web3.utils.isAddress(destination);

    if(!isValidAddress) {
        return res.render('withdraw-request', { user: user,  id: uuid.v4(), warning: 'Destination address is not a Ethereum one' });
    }
        
    if (!password)
        return res.render('withdraw-request', { user: user,  id: uuid.v4(), warning: 'Must enter a password' });

    if(!lib.isUUIDv4(withdrawalId))
      return res.render('withdraw-request', { user: user,  id: uuid.v4(), warning: 'Could not find a one-time token' });

    database.validateUser(user.username, password, otp, function(err) {

        if (err) {
            if (err === 'WRONG_PASSWORD')
                return res.render('withdraw-request', { user: user, id: uuid.v4(), warning: 'wrong password, try it again...' });
            if (err === 'INVALID_OTP')
                return res.render('withdraw-request', { user: user, id: uuid.v4(), warning: 'invalid one-time token' });
            //Should be an user
            return next(new Error('Unable to validate user handling withdrawal: \n' + err));
        }

        withdraw(req.user.id, amount, destination, withdrawalId, function(err) {
            if (err) {
                if (err === 'NOT_ENOUGH_MONEY')
                    return res.render('withdraw-request', { user: user, id: uuid.v4(), warning: 'Not enough money to process withdraw.' });
                else if (err === 'PENDING')
                    return res.render('withdraw-request', { user: user,  id: uuid.v4(), success: 'Withdrawal successful, however hot wallet was empty. Withdrawal will be reviewed and sent ASAP' });
                else if(err === 'SAME_WITHDRAWAL_ID')
                    return res.render('withdraw-request', { user: user,  id: uuid.v4(), warning: 'Please reload your page, it looks like you tried to make the same transaction twice.' });
                else if(err === 'FUNDING_QUEUED')
                    return res.render('withdraw-request', { user: user,  id: uuid.v4(), success: 'Your transaction is being processed come back later to see the status.' });
                else
                    return next(new Error('Unable to withdraw: ' + err));
            }

            return res.render('withdraw-request', { user: user, id: uuid.v4(), success: 'OK' });
        });
    });
};

/**
 * GET
 * Restricted API
 * Shows the deposit request page
 **/
exports.withdrawRequest = function(req, res) {
    assert(req.user);
    res.render('withdraw-request', { user: req.user,  id: uuid.v4() });
};

/**
 * GET
 * Restricted API
 * Shows the send tip page
 **/
exports.tipSend = function(req, res) {
    assert(req.user);
    res.render('tip-send', { user: req.user, id: uuid.v4() });
};

/**
 * GET
 * Restricted API
 * Shows the tip history
 **/
exports.tip = function(req, res, next) {
    var user = req.user;
    console.log(user);
    assert(user);

    database.getTips(user.id, function(err, tips) {
        if (err)
            console.log(err);
            return next(new Error('Unable to get tips: \n' + err));
        // var date, created;
        // tips.forEach(function(index, tip) {
        //     date = new Date(tip.created);
        //     created = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`; 
        //     console.log(created);
        //     tip.created = created;
        // })
        user.tips = tips;

        res.render('tip', { user: user });
    });
};

/**
 * POST
 * Restricted API
 * Process a depositrequest
 **/
// exports.handleDepositRequest = function(req, res, next) {
//     var user = req.user;
//     assert(user);

//     var currency_type = req.body.currency_type;
//     if(currency_type == 'USD') 
//     { 
//         var currency_amt = req.body.usd_currency_amt;
//         var wow_amt = req.body.usd_wow_amt;
//         var deposit_name = req.body.usd_deposit_name;

//     }
//     else if(currency_type == 'KRW') 
//     { 
//         var currency_amt = req.body.krw_currency_amt; 
//         var wow_amt = req.body.krw_wow_amt;
//         var deposit_name = req.body.krw_deposit_name;
//     }
//     else if(currency_type == 'VND')  
//     { 
//         var currency_amt = req.body.vnd_currency_amt;
//         var wow_amt = req.body.vnd_wow_amt;
//         var deposit_name = req.body.vnd_deposit_name;
//     }
//     else{
//         var currency_amt = '';
//         var wow_amt = '';
//         var deposit_name = '';
//     }
//     if(currency_type == 'ETH') { var deposit_address = req.body.eth_address; } else{ var deposit_address = ''; }  

//     var date = new Date();
//     var hour = date.getHours();
//     hour = (hour < 10 ? "0" : "") + hour;
//     var min = date.getMinutes();
//     min = (min < 10 ? "0" : "") + min;
//     var sec = date.getSeconds();
//     sec = (sec < 10 ? "0" : "") + sec;
//     var year = date.getFullYear();
//     var month = date.getMonth() + 1;
//     month = (month < 10 ? "0" : "") + month;
//     var day = date.getDate();
//     day = (day < 10 ? "0" : "") + day;
//     var request_time = year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;      

//     depositrequest(user.id, currency_type, currency_amt, wow_amt, deposit_name, deposit_address, request_time, function(err) {
//                 if (err) {                   
//                     return next(new Error('Unable to request deposit: ' + err));
//                 }
//                 else{ 
//                     if(currency_type == 'USD') 
//                     {  res.redirect('/account/#admininfo_usd'); }
//                     else if(currency_type == 'KRW') 
//                      {  res.redirect('/account/#admininfo_krw'); }  
//                     else if(currency_type == 'VND') 
//                      {  res.redirect('/account/#admininfo_vnd'); }  
//                     else{
//                             res.redirect('/account/#admininfo_eth'); 
//                         }                
//                     }
//             });  
    
// };

exports.handleDepositRequest = function(req, res, next) {
    var user = req.user;
    var status = '0';
    assert(user);
    var deposit_address = req.body.eth_address;

    console.log('ETHEREUM DEPOSIT ADD', req.body.eth_address);

    if(req.body.ethereum_amt ==''){
        res.redirect('/account/#depnull-error');
    }
    else{
        var currency_type = 'ITEN';  
    
        var currency_amt = Number(req.body.ethereum_amt);
        var wow_amt = Number(req.body.ethereum_amt);
        var deposit_name = '';

        var deposit_address = req.body.eth_address;        
        depositrequesteth(user.id, deposit_address, currency_type, currency_amt, wow_amt, deposit_name, status, function(err) {
                if (err) {                   
                    return next(new Error('Unable to request deposit: ' + err));
                }
                else{ 
                        res.redirect('/account/#eth-success');                                     
                    }
            });  
   }   
    
    console.log('Currency Amt', currency_amt);
        
};

exports.cancelWithdraw = function(req, res, next) {
    var user = req.user;
    assert(user);  
    var cancel_id = req.body.forcancel;
    console.log('cccccccccccccccc', cancel_id)
    var canceltext = "2"; 
       
    //database.requestwithdraw(userid, currency_type, status, amount, country, bank_name, owner_name, account_address, etherum_address, function (err, reqId) {
    database.cancelWithdraw(user.id, cancel_id, canceltext ,function (err, reqId) {
                if (err) {                   
                    return next(new Error('Unable to cancel withdraw: ' + err));
                }
                else{                     
                    res.redirect('/account/#successcancelwithdraw');                                     
                    }
            });    
};

exports.cancelDeposit = function(req, res, next) {
    var user = req.user;
    assert(user);  
    var cancel_id = req.body.cancel_id;
    var canceltext = "2"; 
       
    database.cancelDeposit(user.id, cancel_id, canceltext ,function (err, reqId) {
                if (err) {                   
                    return next(new Error('Unable to cancel deposit: ' + err));
                }
                else{                     
                    res.redirect('/account/#successcanceldeposit');                                     
                    }
            });    
};

exports.withdrawinfo = function(req, res, next) {    
    var id = req.params.id;
    var user = req.user;     
    
    database.getwithdrawinfo(id,function (err, withinfo) {
                if (err) {                   
                    return next(new Error('Unable to get withdraw information: ' + err));
                }
                else{ 
                    user.withinfo = withinfo;
                    //console.log(user.withinfo);                    
                    //res.redirect('/account/#showwithdrawinfo'); 
                    res.render('showwithdrawinfo', { user: user });                                    
                    }
            });   
         
};
exports.senddeposit = function(req, res, next) {       
       var user_deposit_address = lib.deriveAddress(user_id);       

        web33 = new web3(new web3.providers.HttpProvider('https://mainnet.infura.io/v3/7c7093b1659f4c0d82dedbfd29736ce6'));

        web33.eth.getBalance(user_deposit_address, function (error, result) {
            if (!error && web33.utils.fromWei(result,'ether') > 0){               
                console.log('Ether:', web33.utils.fromWei(result,'ether')); 
             }                
            else{
                console.log('No Ethereum amount: ', error);
                //res.redirect('/account/#deposit-send-fail');
                res.status(200).json({
                      message: 'fail',
                  });    
            }
        });               

};

exports.sendwithdraw = function(req, res, next) {
        var user = req.user;
       var fundingId = req.params.id;

       database.getFundingInfo(fundingId, function(err, withdraw_info) {
        if (err) {
            console.log(err);
            return next(new Error('Unable to get withdraw information: \n' + err));
        }
        
        var userid = withdraw_info[0].userid;
        var amount = withdraw_info[0].amount;
        var destination = withdraw_info[0].address;
        var withdrawalId = withdraw_info[0].withdrawal_id;

        console.log('USER ID:', userid);
        console.log('AMOUNT:', amount);
        console.log('DESTINATION ADD:', destination);
        console.log('Withdrawal_ID:', withdrawalId);

        withdraw(userid, amount, destination, withdrawalId, fundingId, function(err) {
            if (err) {
                console.log(err);
                if (err === 'NOT_ENOUGH_MONEY')
                    return res.redirect('/account/#withdraw-warning-nomoney');
                else if (err === 'PENDING')
                    return res.redirect('/account/#withdraw-warning-pending');
                
                else if(err === 'FUNDING_QUEUED')
                    return res.redirect('/account/#withdraw-warning-funding');
                else
                    return res.redirect('/account/#withdraw-warning-funding');
            }

            return res.redirect('/account/#successwithdraw');
        });      
    });
      
};


exports.handlenewWithdrawRequest = function(req, res, next) {
    var user = req.user;
    var status = '0';
    assert(user);

    if(req.body.eth_amount ==''){
        res.redirect('/account/#warning-withdraw'); 
    }
    else{
        var currency_type = 'ITEN';  
        var withdrawal_id = req.body.withdrawal_id; 
        var miningFee = config.MINING_FEE; 
        
        var amount = Math.round(req.body.eth_amount);     
        var etherum_address = req.body.eth_etherum_address; 
        var currency_amount = amount + Number(miningFee);
       
        var country = '';
        var bank_name = '';
        var owner_name = '';
        var account_address = '';

    database.getUserBalance(user.id, function(err, balance) {
        if (err) {
            console.log(err);
            return next(new Error('Unable to get withdraw information: \n' + err));
        }        
        else{
            var balance = balance;
            if(balance < amount )
            {
                 res.redirect('/account/#amount-notenough');  
            } 
            else{
                withdrawrequest(user.id, currency_type, amount, currency_amount, country, bank_name, owner_name, account_address, etherum_address, status, withdrawal_id, function(err) {
                if (err) {                   
                    return next(new Error('Unable to request deposit: ' + err));
                }
                else{
                        //Decrease Amount
                        database.decreaseamount(user.id, amount,  function(err) {
                            //console.log('Error withdraw',err);
                         });                         

                        res.redirect('/account/#successwithdraw');        
                    }
            }); 
          }
        }   
    }); 

    }              
};


/**
 * POST
 * Restricted API
 * Process a tip
 **/
exports.handleTipSend = function(req, res, next) {
    var user = req.user;
    assert(user);

    if(req.body.your_amount =='' || req.body.recipient=='' || req.body.your_password) {
        return res.redirect('/account/#input-warning');
    }   
    else{
        var amount = req.body.your_amount;
    var recipientUsername = req.body.recipient;
    console.log('sssssssssssssssssssss', recipientUsername);
    var tipTxId = uuid.v4();
    var password = lib.removeNullsAndTrim(req.body.your_password);
    var otp = lib.removeNullsAndTrim(req.body.otp);
    var minTip = config.MIN_TIP;

    var r =  /^[1-9]\d*(\.\d{0,2})?$/;
    if (!r.test(amount))
        return res.render('warning-tip-send', { user: user, id: uuid.v4(),  warning: 'Not a valid amount' });

    // amount = Math.round(parseFloat(amount) * 100);
    //  assert(Number.isFinite(amount));

    if (amount < config.MIN_TIP)
        return res.render('warning-tip-send', { user: user,  id: uuid.v4(), warning: 'You must send ' + minTip + ' or more'  });

    if (typeof recipientUsername !== 'string')
        return res.render('warning-tip-send', { user: user,  id: uuid.v4(), warning: 'Destination User ID not provided' });    

    if (!password)
        return res.render('warning-tip-send', { user: user,  id: uuid.v4(), warning: 'Must enter a password' });

    // if(!lib.isUUIDv4(tipTxId))
    //     return res.render('warning-tip-send', { user: user,  id: uuid.v4(), warning: 'Could not find a one-time token' });
    //console.log('uuid:',uuid.v4());
    // return res.render('warning-tip-send', { user: user, id: uuid.v4(), success: 'OK' });

    database.getUserBalance(user.id, function(err, balance) {
    if (err) {
        console.log(err);
        return next(new Error('Unable to get withdraw information: \n' + err));
    }
    
    else{
        var balance = balance;
        if(balance < amount )
        {
             res.redirect('/account/#amount-notenough');  
        }   
        else{
            database.validateUser(user.username, password, otp, function(err) {

        if (err) {
            if (err === 'WRONG_PASSWORD')
                //return res.render('warning-tip-send', { user: user, id: uuid.v4(), warning: 'wrong password, try it again...' });
            return res.redirect('/account/#sender-wrongpass');
            // if (err === 'INVALID_OTP')
            //     return res.render('tip-send', { user: user, id: uuid.v4(), warning: 'invalid one-time token' });
            //Should be an user
            return next(new Error('Unable to validate user handling withdrawal: \n' + err));
        }

        //Call api to update into wowgo.in

        //to call api
        var request = require('request'),
        username = "pp1",
        password = "12345",
        url = "http://wowgo.in/sock/sock.php",
        auth =  new Buffer(username + ":" + password).toString("base64");

        request(
            {
                url : url,
                headers : {
                    "Authorization" : auth
                },
                data: 'something'
            },
            function (error, response, body) {
                console.log('sock sock', body)
                // Do more stuff with 'body' here
            }
        );


        database.getUserFromUsername(recipientUsername, function(err, data) {
        
            if (err === 'NO_USER')
                return res.render('warning-tip-send', { user: user,  id: uuid.v4(), warning: 'This Recipient User ID does not exists' })
            if (err)
                return res.redirect('/account/#no-receipt-user');

             var recipient = data;

            if(recipient.id === user.id) 
                return res.render('warning-tip-send', { user: user,  id: uuid.v4(), warning: 'You can NOT send tip to yourself.' })

            //return res.render('warning-tip-send', { user: user, id: uuid.v4(), success: 'OK' });
            
            tip(user.id, recipient.id, amount, tipTxId, function(err) {
                if (err) {
                    if (err === 'NOT_ENOUGH_MONEY')
                        return res.render('warning-tip-send', { user: user, id: uuid.v4(), warning: 'Not enough money to send tip.' });
                    else if (err === 'PENDING')
                        return res.render('warning-tip-send', { user: user,  id: uuid.v4(), success: 'Tip submission successful, however hot wallet was empty. Tip will be reviewed and sent ASAP' });
                    else if(err === 'SAME_WITHDRAWAL_ID')
                        return res.render('warning-tip-send', { user: user,  id: uuid.v4(), warning: 'Please reload your page, it looks like you tried to make the same transaction twice.' });
                    else if(err === 'FUNDING_QUEUED')
                        return res.render('warning-tip-send', { user: user,  id: uuid.v4(), success: 'Your transaction is being processed come back later to see the status.' });
                    else
                        return next(new Error('Unable to send tip: ' + err));
                }
                else{ 
                       res.redirect('/account/#tip-send-successfully');       
                    //res.render('support', { user: user, id: uuid.v4(), success: 'OK' });
                }
                
            });

        });
    }); 

        } 
    }
}); 
    }
      
    
};


/**
 * GET
 * Restricted API
 * Shows the support page
 **/
exports.contact = function(req, res) {
    assert(req.user);
    //res.render('support', { user: req.user })
    return res.redirect('/account/#register');
};


