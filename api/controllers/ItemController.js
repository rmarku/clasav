/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getItems: function (req, res) {
      Item.find({}).exec(function(err, data){
        return res.json(data);
      });
  }
};

