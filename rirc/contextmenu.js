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
var gui             = global.gui;
var $               = global.jQuery;
var document        = global.document;

var fileMenu        = new gui.Menu();

fileMenu.append(new gui.MenuItem({ label: 'YOLO' }));
fileMenu.append(new gui.MenuItem({ label: 'WUT' }));
fileMenu.append(new gui.MenuItem({ type: 'separator' }));
fileMenu.append(new gui.MenuItem({ label: 'Exit' }));


//for (var i = 0; i < menu.items.length; ++i) {
//  console.log(menu.items[i]);
//}
$(document).ready(function() {
    $("#fileMenu").click(function(event) {
        event.preventDefault();
        var y = $(this).offset().top + $(this).outerHeight(true);
        var x = $(this).offset().left;
        fileMenu.popup(x, y);
    });
});
