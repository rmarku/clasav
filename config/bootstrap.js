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


    var schedule = require('node-schedule');
    Object.keys(sails.config.crontab).forEach(function (key) {
        var val = sails.config.crontab[key];
        schedule.scheduleJob(key, val);
    });

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

        }
        else {
            cb();
        }
        /*
         else {
         Misiones_x_Personaje.destroy({}).exec(function(err,mxp){
         if (err)
         console.log(err);
         });
         Misiones.destroy({}).exec(function(err,misi){
         if (err)
         console.log(err);
         });
         var Barrels = require('barrels');
         var barrels = new Barrels();
         var fixtures = barrels.data;
         barrels.populate(['misiones'],function (err) {
         console.log(err);
         cb();
         });
         // Importar todas las misiones de nuevo :(
         }
         */
    });
};
