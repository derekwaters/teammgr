module.exports = {
    ensureAuthenticated : function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'please login to view this resource');

        var redirectAfter = encodeURI(req.originalUrl);
        console.log('REDIRECTING TO /users/login?redirectAfter=' + redirectAfter);
        res.redirect('/users/login?redirectAfter=' + redirectAfter);
    }
}