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


    io.socket.on('chat_msg', function messageReceived(obj) {
        var el = $('#divChat');

        el.append('<span><b>' + obj.pj + ': </b>' + chat.texto(obj.msg) + '<br></span>')
            .stop().animate({scrollTop: el[0].scrollHeight}, 1000);
        document.getElementById('ChatAudio').play();
    });

    io.socket.on('GameJoin', chat.joinList);
    io.socket.on('GameLeave', chat.leaveList);
});

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
    send: function () {
        var msg = document.getElementById('msjChat').value;
        document.getElementById('msjChat').value = '';
        if (msg !== '')
            io.socket.post('/api/chat/send',
                {
                    pj: game.mainPlayer.data.id,
                    msg: msg
                },
                function (data) {
                    if (typeof data.ok !== 'undefined') {
                        var el = $('#divChat');
                        el.append('<span><b style="color: #334477;">' + game.mainPlayer.data.nombre + ': </b>' + chat.texto(msg) + '<br></span>')
                            .stop().animate({scrollTop: el[0].scrollHeight}, 1000);
                    }
                });
    },
    texto: function (txt) {
        var regex;
        for (var emo in this.emojis) {
            regex = new RegExp(emo.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "ig");
            txt = txt.replace(regex, '<img class="emoji" src="/images/chat/' + this.emojis[emo] + '.png" >');

        }
        return txt;
    },
    getList: function (conec) {
        chat.conectados = Array();
        if (conec.length > 0) {
            for (var i = 0; i < conec.length; i++) {
                chat.conectados.push(conec[i].nombre);
            }
        }
        chat.updateList();
    },
    joinList: function (pj) {
        var position = $.inArray(pj.nombre, chat.conectados);
        if (!~position) chat.conectados.push(pj.nombre);

        chat.updateList();
    },
    leaveList: function (pj) {
        var position = $.inArray(pj.nombre, chat.conectados);
        if (~position) chat.conectados.splice(position, 1);

        chat.updateList();
    },
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