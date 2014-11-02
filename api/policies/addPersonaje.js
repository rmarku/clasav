/**
 * Created by martin on 24/10/14.
 */


module.exports = function addPersonaje(req, res, next) {
    if (typeof req.session.passport != 'undefined') {
        var userid = req.session.passport.user;
        // Si hay create agregar el UserId

        if (req.options.action == 'create') {
            console.log(req.body);
            var pantalon = function () {
                Item_instancia.create(
                    {
                        user: userid,
                        item: 1,
                        seccion_inventario: 1,
                        cantidad: 1,
                        usando: 'true'
                    }).exec(function (itemi) {
                        req.body.pantalon = itemi;
                    });
            };
            var torso = function () {
                Item_instancia.create(
                    {
                        user: userid,
                        item: 2,
                        seccion_inventario: 1,
                        cantidad: 1,
                        usando: 'true'
                    }).exec(function (itemi) {
                        req.body.torso = itemi;

                        pantalon();
                    });
            };
            Item_instancia.create(
                {
                    user: userid,
                    item: 3,
                    seccion_inventario: 3,
                    cantidad: 1,
                    usando: 'true'
                }).exec(function (itemi) {
                    req.body.zapatos = itemi;

                    pantalon();
                });
        }
    }
    return next();
}