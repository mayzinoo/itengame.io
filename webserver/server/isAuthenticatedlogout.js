var database = require('./database');
const isAuthenticatedlogout = (req, res, next) => {

    
  // simple check to see if the user is authenicated or not,
  // if not redirect the user to the SSO Server for Login
  // pass the redirect URL as current URL
  // serviceURL is where the sso should redirect in case of valid user
  const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`;
  console.log('logoutttttttttttt', req.session.user)

  

  if (req.session.user != null) {
    delete req.session.user;
    res.clearCookie('id');
    
    
    console.log('qqqqqqqqqqqqqqq', req.session.user)
    return res.redirect(
      `http://sso.ankuranand.com:3010/simplesso/deletesession?serviceURL=${redirectURL}`
    );
    
  //   return res.redirect(
  //     `https://wowgo.io/simplesso/deletesession?serviceURL=${redirectURL}`
  //   );
   }
  
};

module.exports = isAuthenticatedlogout;
