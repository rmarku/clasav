/**
 * Institucion_x_userController
 *
 * @description :: Server-side logic for managing institucion_x_users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    set_situacion: function (req,res) {
        var situacion = req.param('situacion');
        var institucion_x_userID = req.param('institucion_x_user');
        var institucionID = req.param('institucion');


        Institucion_x_user.update(institucion_x_userID,{situacion:situacion}).exec(function afterUpdate(err,updated){
            if(!err){
                sails.sockets.broadcast("institucion:"+institucionID,'userUpdatedFromEsperaProfesor',updated,req.socket);
                return res.send("success");
            }
            else return res.send(null);
        });


    }

};

