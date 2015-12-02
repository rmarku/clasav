/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

   models: {
     connection: 'MongoLab'
   },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

   port: 1333,
   host: '127.0.0.1',

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }
  proxyHost: "www.clasav.com",
  proxyPort: "80",

    session: {
        adapter: 'redis',
        host: 'greeneye.redistogo.com',
        port: '11588',
        db: 'redistogo',
        pass: '***REMOVED***'
    },

    sockets: {
        adapter: 'redis',
        host: 'greeneye.redistogo.com',
        port: '11588',
        db: 'redistogo',
        pass: '***REMOVED***'
    },


    passport:{
      facebook:{
	options:{
	    scope: ['email'],
            clientID: '489843304522461',
            clientSecret: '***REMOVED***'        
        }	
      },
     google:{
        options:{
            scope: ['email'],
            clientID: '985736410162-siap72n4a0atqnuppcapabe77gculpnc.apps.googleusercontent.com',
            clientSecret: '***REMOVED***'
        }

	}
    }
};
