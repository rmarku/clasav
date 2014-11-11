/**
 * Created by martin on 24/10/14.
 */


module.exports = function addPersonaje(req, res, next) {

    if (req.options.action == 'create') {

        var userID = req.session.passport.user;

        if(!userID) {
            return res.send('No existe un usuario Logueado');

        }

        req.body.user = [
            {id: userID}
        ];

    }
    return next();
    /*
    if (typeof req.session.passport != 'undefined') {
        var userid = req.session.passport.user;
        // Si hay create agregar el UserId

    }
    return next();
    */
};


