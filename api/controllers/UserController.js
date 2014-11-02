/**
 * UserController.js
 *
 * @description :: Server-side logic for managing materias
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    getUser: function (req, res) {
        if (typeof req.session.passport != 'undefined') {
            var user = req.session.passport.user;
            return res.json({
                'userId': user});
        }
        return res.json({
            error:'Sesión no iniciada'
        });
    }
};

