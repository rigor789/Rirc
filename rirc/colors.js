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
exports.Colors = function() {
    this.colors  = [
        'black',
        'blue',
        'green',
        'red',
        'orange',
    ];
    this.current = -1;
}

exports.Colors.prototype.next = function() {
    this.current++;
    if(this.current == this.colors.length) {
        this.current = 0;
    }
    return this.colors[this.current];
};
