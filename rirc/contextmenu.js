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

function Menu() {
    this.menu = new gui.Menu();
}

Menu.prototype.add = function(label, callback) {
    this.menu.append(new gui.MenuItem({
        click: callback,
        label: label
    }));
}

Menu.prototype.addSeparator = function(callback) {
    this.menu.append(new gui.MenuItem({ type: 'separator' }));
}

Menu.prototype.embed = function(element) {
    var men = this.menu;
    element.click(function(event) {
        event.preventDefault();
        var y = element.offset().top + element.outerHeight(true);
        var x = element.offset().left;
        men.popup(x, y);
    });
}


// Such test
var fileMenu = new Menu();
fileMenu.add("Connect", function() {
    console.log("Such connection, woaw!");
});
fileMenu.add("Disconnect", function() {
    console.log("So disconnected, woaw!");
});
fileMenu.addSeparator();
fileMenu.add("Exit", function() {
    global.mainWindow.hide();
    gui.App.quit();
});
fileMenu.embed($("#fileMenu"));

var editMenu = new Menu();
editMenu.add("Parameters", function() {
    console.log("Such editing, so parameters");
});
editMenu.embed($("#editMenu"));

var helpMenu = new Menu();
helpMenu.add("About", function() {
    console.log("Such editing, so parameters");
});
helpMenu.embed($("#helpMenu"));
