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

var fs              = require('fs');            // Filesystem
var path            = require('path');          // Path

exports.loadSettings = function loadSettings() {
    var settings = {};
    try {
        settings = JSON.parse(fs.readFileSync(path.dirname(process.execPath) + path.sep + "settings.json", 'utf8'));
    } catch(err) {
        console.error(err);
        settings = {
            nickname: "rirc",
            networks: [
                {
                    ip: "irc.esper.net",
                    channels: [ "#rirc" ]
                }
            ]
        }
        exports.saveSettings(settings);
    } finally {
        return settings;
    }
};

exports.saveSettings = function saveSettings(settings) {
    fs.writeFile( path.dirname(process.execPath) + path.sep + "settings.json", JSON.stringify( settings ), "utf8", function(err) {
        if (err) throw err;
        console.log('Settings saved!');
    });
};