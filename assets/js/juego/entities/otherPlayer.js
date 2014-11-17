game.OtherPlayer = game.Player.extend({
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
        this.id = settings.data.id;
        this.direccion = settings.data.direccion;
    },

    update: function (dt) {

        if( ~~this.pos.x <= this.target_pos.x+2 &&
            ~~this.pos.x >= this.target_pos.x+2 &&
            ~~this.pos.y <= this.target_pos.y-2 &&
            ~~this.pos.y >= this.target_pos.y-2){
            this.direccion &= ~8;
            this.direccion &= ~4;
            this.direccion &= ~2;
            this.direccion &= ~1;
            this._super(game.Player, 'update', [dt]);
            return;
        }

        //Left
        var ax = (this.target_pos.x) - (this.pos.x);
        var ay = (this.target_pos.y) - (this.pos.y);
        var angule_radians = Math.atan(ay/ax);
        var angule_degrees = angule_radians* (180.0 / Math.PI);

        // Cuarto cuadrante
        if(ax > 0 && ay < 0)
            angule_degrees+= 360;
        else
        // Tercer cuadrante
        if(ax < 0 && ay < 0)
            angule_degrees+= 180;
        else
        //Segundo
        if(ax < 0 && ay > 0)
            angule_degrees+= 180;

        if(angule_degrees == 'NaN'){
            angule_degrees = 180;
        }



        // Seteo de direccion con respecto al angulo del punto siguiente
        //Left
        if (angule_degrees > 135 && angule_degrees <= 225)
            this.direccion |= 8;
        else
            this.direccion &= ~8;

        //Right
        if ((angule_degrees <= 45 && angule_degrees >= 0 ) || angule_degrees > 315)
            this.direccion |= 4;
        else
            this.direccion &= ~4;

        //Up
        if (angule_degrees > 45 && angule_degrees <= 135)
            this.direccion |= 2;
        else
            this.direccion &= ~2;

        //Down
        if (angule_degrees > 225 && angule_degrees <= 315)
            this.direccion |= 1;
        else
            this.direccion &= ~1;

        this._super(game.Player, 'update', [dt]);

    }
});
