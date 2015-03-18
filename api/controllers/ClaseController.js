/**
 * ClaseController
 *
 * @description :: Server-side logic for managing clases
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    crearClaseProfesor: function (req,res) {
        var nombre = req.param('nombre');
        var mapa_genericoID = req.param('mapaGenericoID');
        var institucionID = req.param('institucionID');

        console.log("Crear Clase Profesor: ",nombre,mapa_genericoID,institucionID);
    }
};

