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
var jf = require('jsonfile');
var util = require('util');
var Promise = require('bluebird')

module.exports.bootstrap = function (cb) {

    sails.services.passport.loadStrategies();

    Items.find({}).then(function(err, items){
        if(items.length == 0) {
            var Barrels = require('barrels');
            var barrels = new Barrels();
            var fixtures = barrels.data;

            barrels.populate(function (err) {
                console.log(err);
                cb();
            });
        }else{
            cb();
        }
    });



    /*
     var fixture_import = function (modelo) {
     var objs = jf.readFileSync('config/fixtures/' + modelo + '.json');
     return Promise.reduce(objs, function (total, obj) {
     return global[modelo].find(obj).then(function (data) {
     if (data.length > 0) {
     return 0;
     } else {
     return global[modelo].create(obj).then
     console.log(JSON.stringify(obj) + "  " + data.length);(function () {
     return 1;
     });
     }
     });
     }, 0);
     }

     var fixtures = ['Mapa_instancia', 'Mapa_generico', 'Clase', 'User', 'Sprite', 'Item'];

     Promise.reduce(fixtures, function (total, item) {

     return fixture_import(item).then(function (dat) {
     return 0;
     });
     }, 0).then(cb);
    */
};
