
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.user){
        req.flash('error', 'User must be signed-In');
        return res.redirect('/login');
    }
    next();
}