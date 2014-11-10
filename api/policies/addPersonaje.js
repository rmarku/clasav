/**
 * Created by martin on 24/10/14.
 */


module.exports = function addPersonaje(req, res, next) {
    if (typeof req.session.passport != 'undefined') {
        var userid = req.session.passport.user;
        // Si hay create agregar el UserId

    }
    return next();
};
