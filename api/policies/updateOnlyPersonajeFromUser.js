/**
 * Created by Fabricio on 11/11/2014.
 */

module.exports = function updateOnlyPersonajeFromUser(req, res, next) {


    if (req.options.action != 'update') {
        return next();
    }

    var userID = req.session.passport.user;
    var personajeID = req.param('id');

    if(!userID) {
        return res.send('No existe un usuario Logueado');
    }

    Personaje.findOne({id:personajeID,duenio:userID}).exec(function findCB(err,personaje) {
        //Si el personaje pertenece al jugador, continuar
        if(!personaje){
            console.log('El personaje no pertenece al Usuario');
            return res.send('El personaje no pertenece al Usuario');
        }
/*
        req.body.user = [
            {id: userID}
        ];
*/
        return next();
    });


};
