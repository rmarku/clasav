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

module.exports.bootstrap = function (cb) {
	
	var materias = [{id:'M987ke',nombre:'ciencias naturales'},{id:'M9234',nombre:'ciencias naturales2'},{id:'M23423',nombre:'ciencias naturales3'}];
				
	var materia_callback = function(err,newUsers){
	  	cb();    
	};
	
	Materia.create(materias).exec(materia_callback);
	
};