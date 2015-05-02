module.exports.crontab = {

    /*
     * The asterisks in the key are equivalent to the
     * schedule setting in crontab, i.e.
     * minute hour day month day-of-week year
     * so in the example below it will run every minute
     */

    '* * * * *': function () {
        Personaje.find().exec(function (err, pjs) {
            pjs.forEach(function (pj) {
                if (pj.energia < pj.energia_max) {
                    pj.energia += Math.ceil(pj.energia_max / 60);
                    pj.save();
                    sails.sockets.broadcast(pj.mapa_instancia.id, 'Player_updateInfo', pj);
                }
            });
        });
    }
};