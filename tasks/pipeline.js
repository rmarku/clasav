/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
    "/js/dependencies/bootstrap/dist/css/bootstrap.css",
    "/js/dependencies/BrandButtons/dist/brand-buttons.min.css",
    "/js/dependencies/BrandButtons/dist/brand-buttons-inversed.min.css",
    "/js/dependencies/font-awesome/css/font-awesome.min.css",
    "/js/dependencies/angular-animate/angular-animate.css",
    "/js/dependencies/angular-toastr/dist/angular-toastr.css",
    'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

    // Dependencias
    "/js/dependencies/sails.io.js/dist/sails.io.js",
    "/js/dependencies/angular/angular.js",
    "/js/dependencies/jquery/dist/jquery.js",
    "/js/dependencies/bootstrap/dist/js/bootstrap.js",
    "/js/dependencies/angular-resource/angular-resource.js",
    "/js/dependencies/angular-route/angular-route.js",
    "/js/dependencies/angular-sails-bind/dist/angular-sails-bind.js",
    "/js/dependencies/angular-toastr/dist/angular-toastr.js",
    "/lib/melonJS.js",
    "/lib/plugins/debug/debugPanel.js",
    "/lib/plugins/debug/particleDebugPanel.js",
    //"/js/dependencies/melonJS/melonJS.js",

    "/js/app.js",
    // Juego
    "/js/juego/main.js",
    "/js/juego/entities/player.js",
    "/js/juego/entities/mainPlayer.js",
    "/js/juego/entities/otherPlayer.js",
    "/js/juego/entities/NPCPlayer.js",
    "/js/juego/hud.js",
    "/js/juego/minimap.js",
    "/js/juego/play.js",
    "/js/juego/chat.js",
    "/js/juego/server.js",

    // WEB
    "/js/app.js",
    "/js/controladores/navVar.js",
    "/js/controladores/controlador.js",
    "/js/helpers.js",
    "/js/controladores/personajes.js",
    "/js/controladores/editUsuario.js"
    //'lib/**/*.js',

    // All of the rest of your client-side js files
    // will be injected here in no particular order.
    //'js/main.js',
    //'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
    'templates/**/*.html'
];


// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function (path) {
    return 'assets/' + path;
});
