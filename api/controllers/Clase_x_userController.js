/**
 * Clase_x_userController
 *
 * @description :: Server-side logic for managing clase_x_users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    set_situacion: function (req,res) {
        var situacion = req.param('situacion');
        var clase_x_userID = req.param('clase_x_user');
        var claseID = req.param('clase');


        Clase_x_user.update(clase_x_userID,{situacion:situacion}).exec(function afterUpdate(err,updated){
            if(!err){
                sails.sockets.broadcast("clase:"+claseID,'userUpdatedFromEspera',updated,req.socket);
                return res.send("success");
            }
            else return res.send(null);
        });


    }

};

