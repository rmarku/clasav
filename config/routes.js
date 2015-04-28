/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    '/': {
        controller: 'auth',
        action: 'login'
    },

    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     *  If a request to a URL doesn't match any of the custom routes above, it  *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/
    //Routes de autentificacion

    '/game': {
        locals:{
            layout:false
        },
        view: 'game'
    },


    'get /login': 'AuthController.login',
    'get /logout': 'AuthController.logout',
    'get /register': 'AuthController.register',

    'post /auth/local': 'AuthController.callback',
    'post /auth/local/:action': 'AuthController.callback',

    'get /auth/:provider': 'AuthController.provider',
    'get /auth/:provider/callback': 'AuthController.callback',
    'get /auth/:provider/:action': 'AuthController.callback',

    '/api/user/getUser': 'UserController.getUser',

    //Personajes
    'get /api/mapa_instancia/join':                 'Mapa_instanciaController.join',
    'get /api/mapa_instancia/leave':                'Mapa_instanciaController.leave',
    'put  /api/personaje/updateStatus':             'PersonajeController.updateStatus',
    'post /api/mapa_instancia/change_level':        'Mapa_instanciaController.change_level',
    'get /api/personaje/getPersonaje_masReciente':  'PersonajeController.getPersonaje_masReciente',
    'get /api/item/getItemsPJ':                     'ItemController.getItemsPJ',
    'get /api/item/:id/useItem':                    'ItemController.useItem',
    'get /api/item/:id/unequipItem':                'ItemController.unequipItem',

    // Misiones
    'get /api/misiones/gettxt':                     'MisionesController.gettxt',
    'get /api/misiones/finish':                     'MisionesController.finish',
    'get /api/misiones/info':                       'MisionesController.info',
    'get /api/clase_x_user/set_situacion':          'Clase_x_userController.set_situacion',

    //Administradores
    'get /api/institucion/crearCInstitucionAdministrador':  'InstitucionController.crearInstitucionAdministrador',
    'get /api/institucion/get_misInstituciones_conUsers':   'InstitucionController.get_misInstituciones_conUsers',
    'get /api/institucion_x_user/set_situacion':            'Institucion_x_userController.set_situacion',

    //Alumnos
    'get /api/clase/solicitarClase':                        'ClaseController.solicitarClase',
    'get /api/institucion/get_institucionesConProfesores':  'InstitucionController.get_institucionesConProfesores',

    //Profesores
    'get /api/clase/crearClaseProfesor':                    'ClaseController.crearClaseProfesor',
    'get /api/institucion/solicitarInstitucion':            'InstitucionController.solicitarInstitucion',
    'get /api/institucion/get_institucionesHabilitadas':    'InstitucionController.get_institucionesHabilitadas',

    'get /api/clase/get_misClases_conUsers':                'ClaseController.get_misClases_conUsers'

};
