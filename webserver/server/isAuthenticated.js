var database = require('./database');
const isAuthenticated = (req, res, next) => {
  // simple check to see if the user is authenicated or not,
  // if not redirect the user to the SSO Server for Login
  // pass the redirect URL as current URL
  // serviceURL is where the sso should redirect in case of valid user
  const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`;
    console.log('user user user', req.session.user)
   if (req.session.user == null || req.session.user == "undefined") {
    return res.redirect(
      `http://sso.ankuranand.com:3010/simplesso/login?serviceURL=${redirectURL}`
    );    
  }
  // if (req.session.user == null || req.session.user == "undefined") {
  //   return res.redirect(
  //     `https://wowgo.io/simplesso/login?serviceURL=${redirectURL}`
  //   );    
  // }
  else{
    //Get session id by name
  const username = req.session.user.username;
  
  //console.log('nnnnnnnnnnnnnnnnnn', username)
  database.getuserid(username, function(err, userId) {
        if (err) { }
        //console.log('uuuuuuuuuuuuuuuuuu', userId)
      database.getsessionbyid(userId, function(err, sessionId) {
        if (err) { }
          //console.log('ssssssssssssssss', sessionId)
        
        database.getuser(sessionId, function(err, user) {          
        req.user = user;        
          });      
      //Set cookie
      res.cookie('id', sessionId); 
      next(); 
      
       });    
    });
  } 
};

module.exports = isAuthenticated;
