/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    getItems: function (req, res) {
        Item.find({}).exec(function (err, data) {
            return res.json(data);
        });
    },
    getItemsPJ: function (req, res) {
        var userId = req.session.passport.user;
        if (!userId) {
            return res.json({err: 'No existe un usuario Logueado'});
        }

        Personaje.getPersonaje_masReciente(userId).then(function ( pj) {
            Item_instancia.find({personaje: pj.id}).exec(function (err, data) {
                return res.json(data);
            });
        }).catch(function(){
            return res.json({err: 'No existe un usuario Logueado'});
        });
    }
};

