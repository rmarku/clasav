/**
 * Created by martin on 24/10/14.
 */


module.exports = function filtroUsuarioAutentificado(req, res, next) {


    var userID = req.session.passport.user;

    if (!userID) {
        return res.send('No existe un usuario Logueado');
    }
    return next();
};
