/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var Promise = require('bluebird')

module.exports.bootstrap = function (cb) {

    sails.services.passport.loadStrategies();

    Item.find({}).then(function (items) {

        if (items.length == 0) {
            var Barrels = require('barrels');
            var barrels = new Barrels();
            var fixtures = barrels.data;
            barrels.populate(function (err) {
                console.log(err);
                cb();
            });
        } else {
            Misiones.destroy({});
            Misiones_x_Personaje.destroy({});

            var Barrels = require('barrels');
            var barrels = new Barrels();
            var fixtures = barrels.data;
            barrels.populate(['misiones','npcplayer','item','sprite'], function (err) {
                console.log(err);
                cb();
            });
        }
    });
};
