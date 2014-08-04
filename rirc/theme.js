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
var fs              = require('fs'),
    path            = require('path'),
    themesdir       = path.dirname(process.execPath) + path.sep + "themes" + path.sep,
    $               = global.jQuery;
    document        = global.document;

function Theme(name) {
    this.name = name;
    this.path = themesdir + name + '.css';
}

Theme.prototype.load = function() {
    var link = $('<link>');
    link.attr('rel', 'stylesheet');
    link.attr('type', 'text/css');
    link.attr('href', 'file:///' + this.path);
    link.appendTo($('head'));
}

Theme.list = function() {
    console.log(colorschemes);
    fs.readdir(colorschemes, function(err, files) {
        if (!err) {
            console.log(files);
        } else {
            fs.mkdirSync(colorschemes);
        }
    });
}

module.exports.Theme      = Theme;
module.exports.Theme.list = Theme.list;