$(function () {
    $("#ChatGly").click(function () {
        var e = $("#ChatGame");
        if (e.css('height') != '30px')
            e.animate({'height': '30px'}, 400);
        else
            e.animate({'height': e.css('max-height')}, 400);
    });

    $("#ventAmigos").click(function () {
        var e = $("#ventAmigos");
        if (e.css('height') != '23px')
            e.animate({'height': '23px'}, 400);
        else
            e.animate({'height': e.css('max-height')}, 400);
    });

    $('#msjChat').keydown(function (e) {
        e.stopImmediatePropagation();
    }).keyup(function (e) {
        if (e.keyCode == 13) {
            chat.send();
        }

        e.stopImmediatePropagation();
    });


    io.socket.on('chat_msg', function (obj) {

        if (game.mainPlayer.data.duenio.inscripto) {
            var el = $('#divChat');

            el.append('<span><b>' + obj.pj + ': </b>' + chat.texto(obj.msg) + '<br></span>')
                .stop().animate({scrollTop: el[0].scrollHeight}, 1000);
            document.getElementById('ChatAudio').play();
        }
    });

    io.socket.on('GameJoin', chat.joinList);
    io.socket.on('GameLeave', chat.leaveList);
});

/**
 * Clase encargada del funcionamiento del Chat.
 * moviles
 * @class movil
 */
chat = {
    conectados: [],
    emojis: {
        ':D': 1,
        ';)': 2,
        ':p': 3,
        ':(': 4,
        ":'(": 5,
        'XD': 6,
        'B)': 7,
        ':o': 8,
        ':)': 9
    },
    /**
     * Se encarga de enviar un mensaje al servidor
     * @method send
     * @memberof chat
     */
    send: function () {
        var msg = document.getElementById('msjChat').value;
        document.getElementById('msjChat').value = '';
        if (msg !== '')
            var el = $('#divChat');
        io.socket.post('/api/chat/send',
            {
                pj: game.mainPlayer.data.id,
                msg: msg
            },
            function (data) {
                if (typeof data.ok !== 'undefined') {
                    el.append('<span><b style="color: #334477;">' + game.mainPlayer.data.nombre + ': </b>' + chat.texto(msg) + '<br></span>')
                        .stop().animate({scrollTop: el[0].scrollHeight}, 1000);
                } else if ((typeof data.msg !== 'undefined')) {
                    switch (data.msg) {
                        case 1:
                            el.append('<span><b style="color: #aa0000;">No estas en ninguna clase, no puedes hablar por chat<br>' +
                                'Para poder chatear y explorar el juego, solicita una clase en' +
                                ' <a href="http://localhost:1337/#/clasesAlumno">Mis Clases</a> </span><br>')
                                .stop().animate({scrollTop: el[0].scrollHeight}, 1000);
                            break;
                    }
                }
            });
    },
    /**
     * Función que acondiciona el texto insertando los emoteiconos
     * @method texto
     * @param {string} txt
     * @memberof chat
     */
    texto: function (txt) {
        var regex;
        for (var emo in this.emojis) {
            regex = new RegExp(emo.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "ig");
            txt = txt.replace(regex, '<img class="emoji" src="/images/chat/' + this.emojis[emo] + '.png" >');

        }
        return txt;
    },
    /**
     * Inserta en la lista de conectados los usuarios conectados
     * @method getList
     * @param {Array} conec
     * @memberof chat
     */
    getList: function (conec) {
        chat.conectados = Array();
        if (conec.length > 0) {
            for (var i = 0; i < conec.length; i++) {
                chat.conectados.push(conec[i].nombre);
            }
        }
        chat.updateList();
    },
    /**
     * Agrega un solo usuario a la lista de conectados
     * @method joinList
     * @param {object} pj
     * @memberof chat
     */
    joinList: function (pj) {
        var position = $.inArray(pj.nombre, chat.conectados);
        if (!~position) chat.conectados.push(pj.nombre);

        chat.updateList();
    },
    /**
     * Elimina de la lista de conectados a un usuario
     * @method leaveList
     * @param {object} pj
     * @memberof chat
     */
    leaveList: function (pj) {
        var position = $.inArray(pj.nombre, chat.conectados);
        if (~position) chat.conectados.splice(position, 1);

        chat.updateList();
    },
    /**
     * Actualiza la lista de usuarios mostrada en el HUD
     * @method updateList
     * @memberof chat
     */
    updateList: function () {
        var lista = $('#ventAmigosConectados');
        lista.html('');
        this.conectados.sort();
        for (var i = 0; i < this.conectados.length; i++) {
            if (this.conectados[i] != game.mainPlayer.data.nombre)
                lista.append('<div class="contacto"><img src="/images/online.svg" style="height: 18px"> ' + this.conectados[i] + '</div>');
        }
    }
};
