module.exports = {
  // If user is authenticated, let them do to the next middleware, if not, send to home page
  ensureAuth: function (req, res, next){
    if(req.isAuthenticated()){
      return next()
    } else {
      res.redirect('/')
    }
  },
  //if person is logged in, dont let them go to the login page, just go to next middleware
  ensureGuest: function(req, res, next){
    if(req.isAuthenticated()){
      res.redirect('/dashboard')
     } else {
        return next ()
      }
    }
  }