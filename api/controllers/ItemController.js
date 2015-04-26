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

        Personaje.getPersonaje_masReciente(userId).then(function (pj) {
            Item_instancia.find({personaje: pj.id}).exec(function (err, data) {
                if (err) return res.json({error: err});
                return res.json(data);
            });
        }).catch(function () {
            return res.json({err: 'Error al traer los items'});
        });
    },
    useItem: function (req, res) {
        var userId = req.session.passport.user;
        var itemId = req.param('id');

        if (!userId) {
            return res.json({err: 'No existe un usuario Logueado'});
        }

        Personaje.getPersonaje_masReciente(userId).then(function (pj) {
            Item_instancia.findOne({personaje: pj.id, id: itemId}).populate('item').exec(function (err, itemi) {

                if (typeof itemi.item !== 'undefined')
                    switch (itemi.item.tipo_item) {
                        case 'consumible':
                            pj.energia += itemi.item.energia;
                            if (pj.energia > pj.energia_max)
                                pj.energia = pj.energia_max;

                            pj.save();
                            Item_instancia.destroy({id: itemi.id}).exec(function () {
                                if (err) {
                                    return res.serverError();
                                }
                                return res.json({ok: 'energia'});
                            });
                            break;
                        case 'sombrero':
                        case 'torso':
                        case 'pantalon':
                        case 'zapatos':
                        case 'brazo':
                        case 'decoracion1':
                        case 'decoracion2':
                        case 'capa':
                        case 'anillo':
                        case 'espada':
                            pj[itemi.item.tipo_item] = itemi;
                            pj.save();
                            return res.json({ok: 'vestimenta'});

                        default:
                            return res.json({ok: 'nada'});
                    }
            });
        }).catch(function () {
            return res.json({err: 'No se pudo usar el item'});
        });
    }
};

