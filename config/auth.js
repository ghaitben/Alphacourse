module.exports = {
  ensureAuthenticated: function(req , res , next) {
    if(req.isAuthenticated())
    {
      return next();
    }
    req.flash('error_msg',"You must log in in order to do that operation.");
    res.redirect('/user/login');
  }
}
