//var app = angular.module('juegoapl', ['ngSailsBind']);

hud = {
    /**
     * Desactiva la visualizacion de todos los paneles de la botonera (inventario, misiones, logros, talentos, personaje)
     * @method noPressBtn
     * @return
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

    toggleAudio: function () {
        if (me.audio.getCurrentTrack() === "snow") {
            $("#audio").attr("src", "../images/iconos/audio_OFF.png");
            me.audio.stopTrack();
        } else {
            $("#audio").attr("src", "../images/iconos/audio_on.png");
            me.audio.playTrack("snow", 0.7);
        }
    },
    update: function () {
        this.superior.update();
        this.inventario.update();
        this.misiones.update();
        this.logros.update();
        this.talentos.update();
        this.personaje.update();
    },
    superior: {
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

    inventario: {
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
        update: function () {
            $.getJSON("api/item/getItemsPJ", function (data) {
                var pj = game.mainPlayer.data;
                document.getElementById('items').innerHTML = '';
                data.forEach(function (it) {
                    var cuerpo = ['sombrero', 'torso', 'pantalon', 'zapatos', 'brazo', 'decoracion1', 'decoracion2', 'capa', 'anillo', 'espada'];
                    var no_vestido = false;

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

                        img.onload = function () {
                            var cnv = tintImage(img, item.color);
                            //div que contiene la imagen
                            var div = document.createElement('div');
                            div.setAttribute('class', 'itemInv'); //<div class="itemInv" >

                            //imagen
                            var ic = document.createElement('img');
                            ic.setAttribute('src', cnv.toDataURL());
                            ic.setAttribute('title', item.nombre);

                            div.appendChild(ic);
                            // Numero si hay maximos
                            if (item.maximo > 1) {
                                var span = document.createElement('span');
                                span.innerHTML = it.cantidad;
                                div.appendChild(span);
                            }
                            document.getElementById('items').appendChild(div);
                        };
                        img.src = 'data/sprites/' + icono;
                    }
                });
            });
        }
    },

    misiones: {
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
        update: function () {
        }
    },

    logros: {
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
        update: function () {
        }
    },

    talentos: {
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
        update: function () {
        }
    },

    personaje: {
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
        update: function () {
            var cuerpo = ['sombrero', 'torso', 'pantalon', 'zapatos', 'brazo', 'decoracion1', 'decoracion2', 'capa', 'anillo', 'espada'];

            cuerpo.forEach(function (it) {
                if (typeof game.mainPlayer.data[it] != 'undefined') {

                    var item = game.items[game.mainPlayer.data[it].item];
                    var icono = game.sprites[item.sprite].icono;


                    var img = new Image();

                    img.onload = function () {
                        var cnv = tintImage(img, item.color);
                        document.getElementById('PJ' + it).firstElementChild.src = cnv.toDataURL();
                    };
                    img.src = 'data/sprites/' + icono;
                }
            });
            var canvas = document.getElementById('PJimage');
            var ctx = canvas.getContext("2d");
            ctx.drawImage(game.mainPlayer.renderable.image, 0, 0);
        }
    },

    movil: {
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
