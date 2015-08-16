/**
 * Clase encargada de toda la funcionalidad del HUD del juego.
 * @class hud
 */

hud = {
    /**
     * Desactiva la visualizacion de todos los paneles de la botonera (inventario, misiones, logros, talentos, personaje)
     * @method noPressBtn
     * @memberof hud
     */
    noPressBtn: function () {
        $("#btnPers").attr("src", "../images/iconos/btn_personaje.png");
        $("#btnInve").attr("src", "../images/iconos/btn_inventario.png");
        $("#btnMisi").attr("src", "../images/iconos/btn_mision.png");
        $("#btnLogr").attr("src", "../images/iconos/btn_logros.png");
        $("#btnTale").attr("src", "../images/iconos/btn_talentos.png");
        $("#inv").hide();
        $("#mis").hide();
        $("#log").hide();
        $("#tal").hide();
        $("#per").hide();
    },

    /**
     * Función para habilitar y deshabilitar el audio del juego
     * @method toggleAudio
     * @memberof hud
     */
    toggleAudio: function () {
        if (me.audio.getCurrentTrack() === "snow") {
            $("#audio").attr("src", "../images/iconos/audio_OFF.png");
            me.audio.stopTrack();
        } else {
            $("#audio").attr("src", "../images/iconos/audio_on.png");
            me.audio.playTrack("snow", 0.7);
        }
    },
    /**
     * Función que llama a todas las actualizaciones de los distintos
     * módulos de HUD
     * @method update
     * @memberof hud
     */
    update: function () {
        this.superior.update();
        this.inventario.update();
        this.misiones.update();
        this.logros.update();
        this.talentos.update();
        this.personaje.update();
    },

    /**
     * Clase encargada de toda la funcionalidad del HUD superior, nivel y barras de energia y exp
     * @class superior
     */
    superior: {
        /**
         * Actualiza los valors y las barras del hud
         * @method update
         * @memberof superior
         */
        update: function () {
            document.getElementById('PJnivel').innerHTML = game.mainPlayer.data.nivel;
            document.getElementById('PJoro').innerHTML = game.mainPlayer.data.oro;
            var ene = document.getElementById('PJenergia');
            var exp = document.getElementById('PJexperiencia');

            var max = game.mainPlayer.data.energia_max;
            var val = game.mainPlayer.data.energia;
            ene.setAttribute('aria-valuenow', val);
            ene.setAttribute('aria-valuemax', max);
            $('#PJenergia').css('width', val * 100 / max + '%');

            max = (game.mainPlayer.data.nivel + game.mainPlayer.data.nivel / 2) * 100;
            val = game.mainPlayer.data.experiencia;
            exp.setAttribute('aria-valuenow', val);
            exp.setAttribute('aria-valuemax', max);
            $('#PJexperiencia').css('width', (val * 100 / max) + '%');

        }
    },

    /**
     * Clase encargada de toda la funcionalidad del HUD inventario
     * @class inventario
     */
    inventario: {
        /**
         * Se encarga de darle comportamiento al boton del inventario
         * @method toggle
         * @memberof inventario
         */
        toggle: function () {
            if ($("#btnInve").attr("src") != "../images/iconos/btn_inventarioOVER.png") {
                hud.noPressBtn();
                $("#btnInve").attr("src", "../images/iconos/btn_inventarioOVER.png");
                me.audio.play("switch26", false);
                $("#inv").show();
            } else {
                $("#btnInve").attr("src", "../images/iconos/btn_inventario.png");
                $("#inv").hide();
            }
        },
        /**
         * Se encarga de actualizar los items dentro del inventario
         * @method update
         * @memberof inventario
         */
        update: function () {
            io.socket.get("/api/item/getItemsPJ", function (data) {
                var pj = game.mainPlayer.data;
                document.getElementById('items').innerHTML = '';
                data.forEach(function (it) {
                    var cuerpo = ['sombrero', 'torso', 'pantalon', 'zapatos', 'brazo', 'decoracion1', 'decoracion2', 'capa', 'anillo', 'espada'];
                    var no_vestido = true;

                    // Me fijo que no este vestido
                    for (var i = 0; i < cuerpo.length; i++) {
                        if (pj[cuerpo[i]] && it.id == pj[cuerpo[i]].id) {
                            no_vestido = false;
                            break;
                        }
                    }

                    // Si no lo esta usando el PJ, lo pongo en el inventario
                    if (no_vestido) {
                        var item = game.items[it.item];
                        var icono = game.sprites[item.sprite].icono;

                        var img = new Image();
                        /**
                         * Description
                         * @method onload

                         */
                        img.onload = function () {
                            var cnv = tintImage(img, item.color);
                            //div que contiene la imagen
                            var div = document.createElement('div');
                            div.setAttribute('class', 'itemInv'); //<div class="itemInv" >

                            //imagen
                            var ic = document.createElement('img');
                            ic.setAttribute('src', cnv.toDataURL());
                            ic.setAttribute('title', item.nombre);
                            ic.setAttribute('data', JSON.stringify(it));

                            div.appendChild(ic);
                            // Numero si hay maximos
                            if (item.maximo > 1) {
                                var span = document.createElement('span');
                                span.innerHTML = it.cantidad;
                                div.appendChild(span);
                            }
                            document.getElementById('items').appendChild(div);
                            ic.ondblclick = hud.inventario.onclick;
                        };
                        img.src = 'data/sprites/' + icono;
                    }
                });
            });
        },
        /**
         * Comportamiento del inventario al hacerle click a un item
         * @method onclick
         * @memberof inventario
         */
        onclick: function () {
            var it = JSON.parse(this.getAttribute('data'));


            io.socket.get("/api/item/" + it.id + "/useItem", function (data) {
                if (typeof data.err != 'undefined') {
                    console.log('error');
                } else if (typeof data.ok != 'undefined') {
                    game.mainPlayer.updateData();
                }
            });
        }
    },

    /**
     * Clase encargada de toda la funcionalidad del HUD de misiones
     * @class misiones
     */
    misiones: {
        /**
         * Comportamiento del boton de misiones
         * @method toggle
         * @memberof misiones
         */
        toggle: function () {
            if ($("#btnMisi").attr("src") != "../images/iconos/btn_misionOVER.png") {
                hud.noPressBtn();
                $("#btnMisi").attr("src", "../images/iconos/btn_misionOVER.png");
                me.audio.play("switch26", false);
                $("#mis").show();
            } else {
                $("#btnMisi").attr("src", "../images/iconos/btn_mision.png");
                $("#mis").hide();
            }
        },
        /**
         * Actualiza el estado de las misiones
         * @method update
         * @memberof misiones
         */
        update: function () {
        }
    },

    /**
     * Clase encargada de toda la funcionalidad del HUD de misiones
     * @class logros
     */
    logros: {
        /**
         * Comportamiento del boton de logros
         * @method toggle
         * @memberof logros
         */
        toggle: function () {
            if ($("#btnLogr").attr("src") != "../images/iconos/btn_logrosOVER.png") {
                hud.noPressBtn();
                $("#btnLogr").attr("src", "../images/iconos/btn_logrosOVER.png");
                me.audio.play("switch26", false);
                $("#log").show();
            } else {
                $("#btnLogr").attr("src", "../images/iconos/btn_logros.png");
                $("#log").hide();
            }

        },
        /**
         * Actualiza el estado de las ventana de logros
         * @method update
         * @memberof logros
         */
        update: function () {
        }
    },

    /**
     * Clase encargada de toda la funcionalidad del HUD de misiones
     * @class talentos
     */
    talentos: {
        /**
         * Comportamiento del boton de talentos
         * @method toggle
         * @memberof talentos
         */
        toggle: function () {
            if ($("#btnTale").attr("src") != "../images/iconos/btn_talentosOVER.png") {
                hud.noPressBtn();
                $("#btnTale").attr("src", "../images/iconos/btn_talentosOVER.png");
                me.audio.play("switch26", false);
                $("#tal").show();
            } else {
                $("#btnTale").attr("src", "../images/iconos/btn_talentos.png");
                $("#tal").hide();
            }

        },
        /**
         * Actualiza el estado de las ventana de talentos
         * @method update
         * @memberof talentos
         */
        update: function () {
        }
    },

    /**
     * Clase encargada de toda la funcionalidad del HUD de misiones
     * @class personaje
     */
    personaje: {
        /**
         * Comportamiento del boton de talentos
         * @method toggle
         * @memberof personaje
         */
        toggle: function () {
            if ($("#btnPers").attr("src") != "../images/iconos/btn_personajeOVER.png") {
                hud.noPressBtn();
                $("#btnPers").attr("src", "../images/iconos/btn_personajeOVER.png");
                me.audio.play("switch26", false);
                $("#per").show();
            } else {
                $("#btnPers").attr("src", "../images/iconos/btn_personaje.png");
                $("#per").hide();
            }
        },
        /**
         * Actualiza el estado de las ventana del personaje
         * @method update
         * @memberof personaje
         */
        update: function () {
            var cuerpo = ['sombrero', 'torso', 'pantalon', 'zapatos', 'brazo', 'decoracion1', 'decoracion2', 'capa', 'anillo', 'espada'];

            cuerpo.forEach(function (it) {
                var item, icono;
                if (typeof game.mainPlayer.data[it] != 'undefined') {
                    item = game.items[game.mainPlayer.data[it].item];
                    icono = game.sprites[item.sprite].icono;
                } else {
                    item = {color: 'ffffff'};
                    icono = 'items/empty.png';
                }
                var img = new Image();

                img.onload = function () {
                    var cnv = tintImage(img, item.color);
                    document.getElementById('PJ' + it).firstElementChild.src = cnv.toDataURL();
                    document.getElementById('PJ' + it).firstElementChild.setAttribute('data', JSON.stringify(game.mainPlayer.data[it]));
                };
                img.src = 'data/sprites/' + icono;
            });
            var canvas = document.getElementById('PJimage');
            var ctx = canvas.getContext("2d");
            ctx.drawImage(game.mainPlayer.renderable.image, 0, 0);
        },
        /**
         * Comportamiento al hacer click en un item dentro de la
         * ventana del personaje
         * @method onclick
         * @param {object} that
         * @memberof personaje
         */
        onclick: function (that) {
            var it = JSON.parse(that.getAttribute('data'));
            if (it !== null)
                io.socket.get("/api/item/" + it.id + "/unequipItem", function (data) {
                    if (typeof data.err != 'undefined') {
                        console.log('error' + data.err);
                    } else if (typeof data.ok != 'undefined') {
                        game.mainPlayer.updateData();
                    }
                });
        }
    },

    /**
     * Clase encargada de agregar los controles para dispositivos
     * moviles
     * @class movil
     */
    movil: {
        /**
         * Inicializacion de los controles
         * @method init
         * @memberof movil
         */
        init: function () {

            // Teclas del hub
            ['izq', 'der', 'arr', 'aba', 'accion'].forEach(function (item) {
                var el = document.getElementById('movil-' + item);
                el.addEventListener('touchstart', hud.movil.touchstart);
                el.addEventListener('touchmove', hud.movil.touchstart);
            });
            document.getElementById('movil').addEventListener('touchend', hud.movil.touchend);

            window.scrollTo(0, 1);
            // escondo chat y amigos
            $("#ChatGame").animate({'height': '30px'}, 400);

            $("#ventAmigos").animate({'height': '23px'}, 400).css('max-height', '170px').css('margin', '0px');
            $('.questModal').css('top', '0');

            //acomodo el minimap
            $("#miniMap").css('zoom', '0.5').css('top', '46px');

            $('#movil').css('display', 'block');

        },
        /**
         * Evento disparado al presionar uno de los de los controles
         * @method touchstart
         * @param {string} ev
         * @memberof movil
         */
        touchstart: function (ev) {
            var key = me.input.KEY.SPACE;
            switch (ev.currentTarget.id.substring(6)) {
                case 'izq':
                    key = me.input.KEY.LEFT;
                    break;
                case 'der':
                    key = me.input.KEY.RIGHT;
                    break;
                case 'arr':
                    key = me.input.KEY.UP;
                    break;
                case 'aba':
                    key = me.input.KEY.DOWN;
                    break;
            }
            hud.movil.touchend();
            me.input.triggerKeyEvent(key, true);
            ev.stopPropagation();
            ev.preventDefault();
        },
        /**
         * Evento disparado al soltar uno de los controles
         * @method touchend
         * @param {string} ev
         * @memberof movil
         */
        touchend: function (ev) {
            [
                me.input.KEY.LEFT,
                me.input.KEY.RIGHT,
                me.input.KEY.UP,
                me.input.KEY.DOWN,
                me.input.KEY.SPACE
            ].forEach(function (item) {
                    me.input.triggerKeyEvent(item, false);
                });
        }
    }
};
