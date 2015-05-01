/**
 * LoggingController
 *
 * @description :: Server-side logic for managing loggings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    show: function(req, res) {
        Log.find(function(err, logs) {
            if (err) {return res.serverError(err);}
            return res.view('error',{logs: logs});
        });
    }
};

