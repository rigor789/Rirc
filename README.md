## ![Logo](https://github.com/rigor789/Rirc/raw/master/icon48.png "Rirc - an IRC client by rigor789") Rirc - an IRC client by rigor789

[![Dependencies](https://david-dm.org/rigor789/rirc.svg)](https://david-dm.org/rigor789/rirc/)
[![Dev Dependencies](https://david-dm.org/rigor789/rirc/dev-status.svg?theme=shields.io)](https://david-dm.org/rigor789/rirc#info=devDependencies)
[![Build Status](https://travis-ci.org/rigor789/Rirc.svg?branch=dev)](https://travis-ci.org/rigor789/Rirc)
[![Release](http://img.shields.io/github/release/rigor789/rirc.svg)](https://github.com/rigor789/Rirc/releases)
[![License](http://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/rigor789/Rirc/blob/master/LICENSE.txt)
[![Gittip](http://img.shields.io/gittip/rigor789.svg)](https://www.gittip.com/rigor789/)

## Introduction

Rirc is an irc client based on `node.js` and `node-webkit`. It runs as a native application.

## Development

Rirc has been abandoned for the most part due to loss in interest. Feel free to fork if interested!

## Features

* A clean GUI
* Connection to an IRC server
* Recieving messages
* Support for multiple networks / channels

## Todo

* Add event listeners
* Add color schemes
* Implement IRC features
* Much much more

## Screenshot

![Screenshot](https://github.com/rigor789/Rirc/raw/master/screenshot.png "Rirc - an IRC client by rigor789")

## Disclaimer

This application is in it's very early stages; it is far from being ready for use! It is full of sample data, and no real functionality behind it. **When being run, it currently connects to irc.esper.net #rirc!**

## Contributing

If you wish to contribute to the project, fork this repository, and submit Pull Requests!

## Connect with us

Come join us on IRC! irc.esper.net #rirc :)

## Dependencies

* [node.js (>=0.4.0)](http://nodejs.org/)
* [node-webkit](https://github.com/rogerwang/node-webkit)
* [irc](https://github.com/martynsmith/node-irc/tree/0.3.x)

## How to run?

In order to run the app you need node-webkit (as listed above). Before you begin, please do `npm install` in the project root, that should install all the dependencies for you. The next thing is to run the app. The easiest way is to drag the whole repository (root folder) folder onto `nw.exe` which you should have downloaded allready (along with a bunch of dll's and files). If you want to make an executable file out of it, refer to `node-webkit`'s documentation! That's it, you should be up and runing!

## Developing / Debugging

When you are developing it is really annoying to drag the whole folder onto the `nw.exe` every time you make a change. In order to make your life easier, change `"toolbar": false` to `"toolbar": true` in `package.json`, and you should see a big reload button and a debug button to see the developer tools you are used to!

## Licence

See [LICENSE.txt](https://github.com/rigor789/Rirc/blob/master/LICENSE.txt)
