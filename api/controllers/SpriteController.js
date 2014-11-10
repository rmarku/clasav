/**
 * SpriteController
 *
 * @description :: Server-side logic for managing sprites
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getSprites: function (req, res) {
    Sprite.find({}).exec(function(err, data){
      return res.json(data);
    });
  }
};

