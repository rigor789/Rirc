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
 *
 * author: bendem
 *
 * This file was inspired by mbaxter's work
 * on the bukkit chat color handling system
 */

'use strict';
function ColorParser() {
    this.incremental_regex = new RegExp('(\x03(1[0-5]|0?[0-9])|\x0f|\x1d|\x02|\x1f)');
    this.open_tag          = '<span class="irc-%s">';
    this.close_tag         = '</span>';
    this.colors            = [
        'white',      'black',
        'dark-blue',  'dark-green',
        'light-red',  'dark-red',
        'magenta',    'orange',
        'yellow',     'light-green',
        'cyan',       'light-cyan',
        'light-blue', 'light-magenta',
        'gray',       'light-gray'
    ];
}

ColorParser.prototype.getColorFromCode = function(code) {
    return this.colors[parseInt(code)];
}

ColorParser.prototype.isColorCode = function(data) {
    return data.match(/^\x03(?:1[0-5]|0?[0-9])$/) != null;
}

ColorParser.prototype.openTag = function(clazz) {
    return this.open_tag.replace('%s', clazz);
}

ColorParser.prototype.strip = function(data) {
    return data.replace(/(\x03(?:1[0-5]|0?[0-9])|\x0f|\x1d|\x02|\x1f)/g, '');
}

ColorParser.prototype.parse = function(data) {
    var res;
    var tag;
    var next         = data;
    var prev         = "";
    var bold         = false;
    var italic       = false;
    var underline    = false;
    var color        = false;
    var closing_tags = 0;
    while(res = this.incremental_regex.exec(next)) {
        tag = "";
        if(this.isColorCode(res[1])) {
            if(color) {
                ++closing_tags;
            }
            tag = this.openTag(this.getColorFromCode(res[2]));
            color = true;
        } else {
            switch(res[1]) {
                // reset
                case '\x0f':
                    if(bold) {
                        ++closing_tags;
                        bold = false;
                    }
                    if(italic) {
                        ++closing_tags;
                        italic = false;
                    }
                    if(underline) {
                        ++closing_tags;
                        underline = false;
                    }
                    if(color) {
                        ++closing_tags;
                        color = false;
                    }
                    break;
                // italic
                case '\x1d':
                    if(italic) {
                        ++closing_tags;
                    } else {
                        tag = this.openTag('italic');
                    }
                    italic = !italic;
                    break;
                // bold
                case '\x02':
                    if(bold) {
                        ++closing_tags;
                    } else {
                        tag = this.openTag('bold');
                    }
                    bold = !bold;
                    break;
                // underline
                case '\x1f':
                    if(underline) {
                        ++closing_tags;
                    } else {
                        tag = this.openTag('underline');
                    }
                    underline = !underline;
                    break;
                default:
                    console.warn('How in the world did you get here?!');
            }
        }
        prev += next.substr(0, res.index);
        while(closing_tags > 0) {
            --closing_tags;
            prev += this.close_tag;
        }
        prev += tag;
        next = next.substr(res.index + res[0].length);
    }
    prev += next;
    if(color) {
        prev += this.close_tag;
    }
    if(bold) {
        prev += this.close_tag;
    }
    if(underline) {
        prev += this.close_tag;
    }
    if(italic) {
        prev += this.close_tag;
    }
    return prev;
}

var parser = new ColorParser();

exports.parse = function(data) {
    return parser.parse(data);
}

exports.strip = function(data) {
    return parser.strip(data);
}
