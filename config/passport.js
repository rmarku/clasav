/**
 * Passport configuration
 *
 * This if the configuration for your Passport.js setup and it where you'd
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {
    local: {
        strategy: require('passport-local').Strategy
    },
    /*
     twitter: {
     name: 'Twitter',
     protocol: 'oauth',
     strategy: require('passport-twitter').Strategy,
     options: {
     consumerKey: 'your-consumer-key',
     consumerSecret: 'your-consumer-secret'
     }
     },

     github: {
     name: 'GitHub',
     protocol: 'oauth2',
     strategy: require('passport-github').Strategy,
     options: {
     clientID: 'your-client-id',
     clientSecret: 'your-client-secret'
     }
     },
     */
    facebook: {
        name: 'Facebook',
        protocol: 'oauth2',
        strategy: require('passport-facebook').Strategy,
        options: {
            scope: ['email'],
            clientID: (process.env.NODE_ENV == 'production') ? '574722529325209' : '1487579574835581',
            clientSecret: (process.env.NODE_ENV == 'production') ? '***REMOVED***' : '***REMOVED***'
        }
    },

    google: {
        name: 'Google',
        protocol: 'oauth2',
        strategy: require('passport-google-oauth').OAuth2Strategy,
        options: {
            scope: ['email'],
            clientID: (process.env.NODE_ENV == 'production') ? '985736410162-loodlrk1jmc8njh3navtu0h1juah8tcj.apps.googleusercontent.com' : '985736410162-nv3c28jsg2mc7gcj8l8vcecca0gapsgg.apps.googleusercontent.com',
            clientSecret: (process.env.NODE_ENV == 'production') ? '***REMOVED***' : '***REMOVED***'
        }
    }
};
console.log(module.exports.passport.google.options.clientSecret)
