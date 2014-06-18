/**
 * Rirc - IRC client by rigor789
 * Copyright (C) 2014  Igor Randjelovic <rigor789>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';
var gui                 = require('nw.gui'),
    irc                 = require('irc'),
    settings            = require('./rirc/settings.js');

global.gui              = gui;
global.jQuery           = jQuery;
global.mainWindow       = gui.Window.get();
global.document         = global.mainWindow.window.document;
global.settings         = settings.loadSettings();

var clientWindow        = require('./rirc/client.js'),
    color_parser        = require('./rirc/colorparser.js'),
    colors              = require('./rirc/colors.js'),
    theme               = require('./rirc/theme.js'),
    user                = require('./rirc/user.js');

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

if(!!global.settings.theme) {
    new theme.Theme(global.settings.theme).load();
}

/**
 * RircSession represents everything that happens in one channel, aka the chat itself, and the users list.
 */
function RircSession(channel) {
    this.channel    = channel;
    this.buffer     = [];
    this.users      = [];
    this.colors     = new colors.Colors();
}

/**
 * drawSession will clear the clients screen, and repopulate it with this session's data
 */
RircSession.prototype.drawSession = function() {
    $("#chatlist tbody").html("");
    $(".userlist").html("");
    $("#user").html(rirc.getActiveClient().nickname);
    this.users.forEach(function(user) {
        $(".userlist").append('<li class="' + user.color + '"><a href="#">' + user.permission + user.nick + '</a></li>');
    });
    $.each(this.buffer, function(key, line) {
        $("#chatlist tbody").append(line);
        $("#chatbuffer").scrollTop($("#chatlist")[0].scrollHeight);
    });
}

/**
 * printLine will print a line to the session
 */
RircSession.prototype.printLine = function(message, sender, color) {
    var line = this.drawLine(message, sender, color);
    this.buffer[this.buffer.length] = line;
}

/**
 * drawLine will display a line, but not add it to the buffer
 */
RircSession.prototype.drawLine = function(message, sender, color) {
    sender      = typeof sender !== 'undefined' ? sender : "*";
    message     = RircUtils.escapeInput(message);
    message     = RircUtils.parseUrls(message);
    message     = RircUtils.parseColors(message);
    var color   = typeof color  !== 'undefined' ? color: "initial";
    var time    = RircUtils.getTimestamp();
    var line    = '<tr>' +
                  '<td class="timestamp">' + time + '</td>' +
                  '<td class="nickname text-right"><span class="' + color + '">' + RircUtils.escapeInput(sender) + '</span></td>' +
                  '<td class="message"><pre>' + message + '</pre></td>' +
                  '</tr>';
    var client  = rirc.getActiveClient();
    var session = client !== undefined ? client.getActiveSession() : undefined;
    if(session === this) {
        $("#chatlist tbody").append(line);
        $("#chatbuffer").scrollTop($("#chatlist")[0].scrollHeight);
    }
    return line;
}

RircSession.prototype.getUser = function(username) {
    for (var i = 0; i < this.users.length; i++) {
        if(this.users[i].nick == username) {
            return this.users[i];
        }
    }
}

/**
 * RircUtils class
 */
function RircUtils() {}

RircUtils.getTimestamp = function() {
    var date = new Date();
    var time = "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] ";
    return time;
}

RircUtils.escapeInput = function(data) {
    if (!!data) {
        return $('<p />').text(data).html();
    } else {
        return '';
    }
}

RircUtils.parseUrls = function(data) {
    var expression = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    data = data.replace(expression, '<a href="$1" class="link" >$1</a>');
    return data;
}

RircUtils.parseColors = function(data) {
    return color_parser.parse(data);
}

/**
 * RircClient class
 */
function RircClient(client, nickname, ip) {
    this.client             = client;
    this.nickname           = nickname;
    this.ip                 = ip;
    this.sessions           = {};
    this.activeSession      = ip;
    var serverSession       = new RircSession(ip);
    var connecting          = "Connecting to " + ip;
    this.sessions[ip]       = serverSession;

    clientWindow.updateStatus(connecting);
    serverSession.printLine(connecting);
    this.addListeners();
}

RircClient.prototype.joinChannel = function(channel) {
    console.log("join channel " + channel);
    var rircClient = rirc.getActiveClient();
    var session = rircClient.setActiveSession(channel);
    rirc.rircChannels.reDraw();
}

RircClient.prototype.getSession = function(channel) {
    channel = channel.toLowerCase();
    var session = null;
    if(channel in this.sessions) {
        session = this.sessions[channel];
    } else {
        session = this.addSession(channel);
    }
    session.drawSession();
    return session;
}

RircClient.prototype.addSession = function(channel) {
    this.sessions[channel] = new RircSession(channel);
    rirc.rircChannels.reDraw();
    return this.getSession(channel);
}

RircClient.prototype.getActiveSession = function() {
    return this.getSession(this.activeSession);
}

RircClient.prototype.setActiveSession = function(session) {
    this.activeSession = session;
    return this.getActiveSession();
}

RircClient.prototype.addListeners = function() {
    var rircClient = this;
    var client = this.client;

    client.addListener('message#', function (from, to, message) {
        console.log('from: ' + from + ' to: ' + to + ' message: ' + message);
        var session = rircClient.getSession(to);
        var user    = session.getUser(from);
        if(!!session)
            // User messaging the chan from outside are undefined
            if(typeof user === 'undefined')
                session.printLine(message, from);
            else
                session.printLine(message, user.nick, user.color);
    });

    client.addListener('pm', function (nick, text, message) {
        var session = rircClient.getSession(nick);
        if(!!session)
            session.printLine(text, nick);
    });

    client.addListener('error', function(message) {
        console.log('error: ', message);
        var session = rircClient.getSession(rircClient.ip);
        if(!!session)
            session.printLine(JSON.stringify(message));
    });

    client.addListener('names', function(channel, nicks) {
        var session     = rircClient.getSession(channel);
        var formatted   = 'Connected users: ';

        session.users   = [];

        $.each(nicks, function(nick, perm) {
            var color = session.colors.next()
            formatted += '<span class="' + color + '">' + nick + '</span> ';
            session.users.push(new user.User(nick, perm, color));
        });

        session.users.sort(function(a, b) {
            function getPermLevel(perm) {
                switch(perm) {
                    case '@': return 0;
                    case '+': return 1;
                    default : return 2;
                }
            }
            var permA = getPermLevel(a.permission);
            var permB = getPermLevel(b.permission);
            if(permA > permB) {
                return 1;
            }
            if(permA < permB) {
                return -1;
            }
            var nickA = a.nick.toLowerCase();
            var nickB = b.nick.toLowerCase();
            if(nickA > nickB) {
                return 1;
            }
            if(nickA < nickB) {
                return -1;
            }
            return 0;
        });

        if(!!session)
            session.printLine(formatted);
    });

    client.addListener('registered', function(message) {
        //{"prefix":"warden.esper.net","server":"warden.esper.net","command":"rpl_welcome","rawCommand":"001","commandType":"reply","args":["rirc","Welcome to the EsperNet Internet Relay Chat Network rirc"]}
        rircClient.nickname = message.args[0];
        var session = rircClient.getSession(rircClient.ip);
        if(!!session) {
            session.printLine('Connected to ' + message.server + ' as ' + rircClient.nickname);
            session.printLine(message.args[1], message.prefix);
        }
        clientWindow.updateStatus("Connected to " + message.server, 3);
    });

    client.addListener('motd', function(motd) {
        var session = rircClient.getSession(rircClient.ip);
        if(!!session)
            session.printLine(motd);
    });

    client.addListener('topic', function(channel, topic, nick, message) {
        var time = new Date(message.args[3] * 1000);
        var session = rircClient.getSession(channel);
        if(!!session)
            session.printLine('Topic set by ' + message.args[2] + ' on ' + time.toTimeString() + ' - ' + topic, message.prefix);
    });

    client.addListener('join', function(channel, nick, message) {
        rircClient.joinChannel(channel);
        var session = rircClient.getSession(channel);
        if(!!session)
            session.printLine(nick + " joined " + channel);
    });

    client.addListener('part', function(channel, nick, reason, message) {
        var session = rircClient.getSession(channel);
        if(!!session)
            session.printLine(nick + ' left ' + channel + '(' + reason + ')');
    });

    client.addListener('quit', function(nick, reason, channels, message) {
        $.each(channels, function(key, channel) {
            var session = rircClient.getSession(channel);
            if(!!session)
                session.printLine(nick + ' quit ' + channel + ' (' + reason + ')');
        });
    });
}

function RircChannels() {
    this.rircClients    = [];
}

RircChannels.prototype.addClient = function(client) {
    if(client in this.rircClients) {
        return;
    }
    var id = this.rircClients.length;
    this.rircClients[id] = client;
    this.reDraw();
    return id;
}

RircChannels.prototype.reDraw = function() {
    $("ul.channels").html("");
    $.each(this.rircClients, function(key, rircClient) {
        $.each(rircClient.sessions, function(key, session) {
            if(rirc.getActiveClient().getActiveSession() === session) {
                $("ul.channels").append('<li><a class="channel active" href="' + rircClient.ip + '|' + session.channel + '">' + session.channel + '</a></li>');
            } else {
                $("ul.channels").append('<li><a class="channel" href="' + rircClient.ip + '|' + session.channel + '">' + session.channel + '</a></li>');
            }
        });
        $("ul.channels").append('<li class="separator"></li>');
    });
}

function Rirc() {
    this.rircChannels = new RircChannels();
    this.activeClient = '';
    this.rircClients  = [];
}

Rirc.prototype.loadNetworks = function() {
    var rirc = this;
    $.each(global.settings.networks, function(key, network) {
        var nickname    = global.settings.nickname;
        var client      = new irc.Client(network.ip, nickname, {
            userName: nickname,
            realName: nickname,
            channels: network.channels,
        });
        var rircClient  = new RircClient(client, nickname, network.ip);
        rirc.addClient(rircClient);
    });
}

Rirc.prototype.addClient = function(client) {
    this.rircClients[client.ip] = client;
    rirc.setActiveClient(client.ip);
    this.rircChannels.addClient(client);
}

Rirc.prototype.getActiveClient = function() {
    return this.rircClients[this.activeClient] || this.rircClients[0];
}

Rirc.prototype.setActiveClient = function(ip) {
    this.activeClient = ip;
    return this.rircClients[this.activeClient];
}

var rirc = new Rirc();
rirc.loadNetworks();

$(document).ready(function() {

    $(document).on('click', 'a.channel', function() {
        var id = $(this).attr('href').split('|');

        var session = rirc.setActiveClient(id[0]).setActiveSession(id[1]);
        rirc.rircChannels.reDraw();
        session.drawSession();
        return false;
    });

    $(document).on('click', 'a.link', function() {
        global.gui.Shell.openExternal($(this).attr("href"));
        return false;
    });

    $("#fileMenu").click(function(event) {
        event.preventDefault();
        var y = $(this).offset().top + $(this).outerHeight(true);
        var x = $(this).offset().left;
        //menu.popup(x, y);
    });

    $("#minimize").click(function() {
        global.mainWindow.minimize();
    });

    $("#close").click(function() {
        global.mainWindow.hide();
        gui.App.quit();
    });

    $("a").click(function(event) {
        event.preventDefault();
    });

    $("input").keydown(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            var message = $(this).val();

            var client = rirc.getActiveClient();
            var session = client.getActiveSession();
            session.printLine(message, client.nickname);
            client.client.say(session.channel, message);
            $(this).val("");
        }
    });

    $(document).keypress(function(event) {
        if(event.ctrlKey) return;
        $("#chatbox").focus();
    });

    $(".rirc").layout({
        applyDefaultStyles: false,
        resizerClass: "dragbar",
        resizeWhileDragging: true,
        closable: false,
        west: {
            minSize: 110,
            maxSize: "45%",
            //size: //From config
        },
        east: {
            minSize: 110,
            maxSize: "45%",
            //size: //From config
        }
    });

});

window.onload = function() {
    global.mainWindow.show();
}
