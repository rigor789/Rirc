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
var irc                 = require('irc');                   // IRC
var gui                 = require('nw.gui');                // NodeWebkit GUI
var settings            = require('./rirc/settings');       // Settings

// Load the settings
global.settings         = settings.loadSettings();
global.gui              = gui;
global.mainWindow       = gui.Window.get();

global.currentSession   = 'server'; 

/**
 * Update client status
 */
global.updateStatus = function(status, duration) {
    $("#status").html(status);
    if(duration === undefined) {
        return;
    }
    setTimeout(
        function() {
            $("#status").html('Idle');
        }, duration * 1000);
};

/**
 * RircSession represents everything that happens in one channel, aka the chat itself, and the users list.
 */
function RircSession(nickname, channel) {
    this.nickname   = nickname;
    this.channel    = channel;
    this.buffer     = [];
    this.users      = [];
}

/**
 * drawSession will clear the clients screen, and repopulate it with this session's data
 */
RircSession.prototype.drawSession = function() {
    $("#chatlist tbody").html("");
    $(".userlist").html("");
    var session = this;
    global.currentSession = session.channel;
    $.each(this.users, function(nick, perm) {
        $(".userlist").append('<li><a href="#">' + perm + nick + '</a></li>');
    });
    $.each(this.buffer, function(key, line) {
        $("#chatlist tbody").append(line);
        $("#chatbuffer").scrollTop($("#chatlist")[0].scrollHeight);
    });
};

/**
 * printLine will print a line to the session
 */
RircSession.prototype.printLine = function(message, sender) {
    var line = this.drawLine(message, sender);
    this.buffer[this.buffer.length] = line;
};

/**
 * drawLine will display a line, but not add it to the buffer
 */
RircSession.prototype.drawLine = function(message, sender) {
    sender = typeof sender !== 'undefined' ? sender : "*";
    var time = RircUtils.getTimestamp();
    var line = '<tr>' +
                '<td class="timestamp">' + time + '</td>' +
                '<td class="nickname text-right">' + RircUtils.escapeInput(sender) + ':</td>' +
                '<td class="message"><pre>' + RircUtils.escapeInput(message) + '</pre></td>' + 
                '</tr>';
    var client = rirc.getActiveClient();
    var session = client !== undefined ? client.getActiveSession() : undefined;
    if(session === this) {
        $("#chatlist tbody").append(line);
        $("#chatbuffer").scrollTop($("#chatlist")[0].scrollHeight);
    }
    return line;
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
};

/**
 * RircClient class
 */
function RircClient(client, nickname, ip) {
    this.client             = client;
    this.nickname           = nickname;
    this.ip                 = ip;
    this.sessions           = {};
    this.activeSession      = 'server';
    var serverSession       = new RircSession(nickname, 'server');
    var connecting          = "Connecting to " + ip;
    this.sessions['server'] = serverSession;
    
    global.updateStatus(connecting);
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
    this.sessions[channel] = new RircSession(this.nickname, channel);
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
        if(!!session)
            session.printLine(message, from);
    });
    
    client.addListener('pm', function (nick, text, message) {
        var session = rircClient.getSession(nick);
        if(!!session)
            session.printLine(text, nick);
    });

    client.addListener('error', function(message) {
        console.log('error: ', message);
        var session = rircClient.getSession('server');
        if(!!session)
            session.printLine(JSON.stringify(message));
    });

    client.addListener('names', function(channel, nicks) {
        var session     = rircClient.getSession(channel);
        var formatted   = 'Connected users: ';
        
        session.users   = nicks;

        $.each(nicks, function(nick, perms) {
            formatted += nick + " ";          
        });
        
        if(!!session)
            session.printLine(formatted);
    });
                    
    client.addListener('registered', function(message) {
        //{"prefix":"warden.esper.net","server":"warden.esper.net","command":"rpl_welcome","rawCommand":"001","commandType":"reply","args":["rirc","Welcome to the EsperNet Internet Relay Chat Network rirc"]}
        rircClient.nickname = message.args[0];
        var session = rircClient.getSession('server');
        if(!!session) {
            session.printLine('Connected to ' + message.server + ' as ' + rircClient.nickname);
            session.printLine(message.args[1], message.prefix);
        }
        global.updateStatus("Connected to " + message.server, 3);
    });
                    
    client.addListener('motd', function(motd) {
        var session = rircClient.getSession('server');
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
                $("ul.channels").append('<li><a class="channel active" href="' + session.channel + '">' + session.channel + '</a></li>');
            } else {
                $("ul.channels").append('<li><a class="channel" href="' + session.channel + '">' + session.channel + '</a></li>');
            }
        });
        $("ul.channels").append('<li class="separator"></li>');
    });
}

function Rirc() {
    this.rircChannels = new RircChannels();
    this.activeClient = 0;
    this.rircClients  = [];
}

Rirc.prototype.loadNetworks = function() {
    var rirc = this;
    $.each(global.settings.networks, function(key, network) {
        var nickname    = global.settings.nickname;
        var client      = new irc.Client(network.ip, nickname, {
            channels: network.channels,
        });
        var rircClient  = new RircClient(client, global.settings.nickname, network.ip);
        var id = rirc.addClient(rircClient);
        rirc.setActiveClient(id);
    });
}

Rirc.prototype.addClient = function(client) {
    var id = this.rircClients.length;
    this.rircClients[id] = client;
    this.rircChannels.addClient(client);
    return id;
}

Rirc.prototype.getActiveClient = function() {
    return this.rircClients[this.activeClient];
}

Rirc.prototype.setActiveClient = function(client) {
    return this.activeClient = client;
}

var rirc = new Rirc();
rirc.loadNetworks();

window.onfocus = function() {
    //global.updateStatus("focus", 1);
}

window.onblur = function() { 
    //global.updateStatus("blur", 1);;
}

$(function(){
    $(document).on('click', 'a.channel', function() {
        var channel = $(this).attr('href');
        var session = rirc.getActiveClient().setActiveSession(channel);
        rirc.rircChannels.reDraw();
        session.drawSession();
        return false;
    });
});

window.onload = function() {

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
    
    $("a").click(function(event) {
        //console.log(event);
    });
                      
    $("a.link").click(function(event) {
        //$("#window").load($(this).attr("href"));
    });
                
    $("input").keydown(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            var message = $(this).val();
            
            var client = rirc.getActiveClient();
            var session = client.getActiveSession();
            session.printLine(message, client.nickname);
            client.client.say(session.channel, message );
            $(this).val("");
        }
    });

    global.mainWindow.show();
}