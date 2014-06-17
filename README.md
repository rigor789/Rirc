## ![Logo](https://github.com/rigor789/Rirc/raw/master/icon48.png "Rirc - an IRC client by rigor789") Rirc - an IRC client by rigor789

![Dependencies](https://david-dm.org/rigor789/rirc.png)
![Dev Dependencies](https://david-dm.org/rigor789/rirc/dev-status.png?theme=shields.io)

## Introduction

Rirc is an irc client based on `node.js` and `node-webkit`. It runs as a native application.

## Features

* A clean GUI
* Connection to an IRC server
* Recieving messages

## Todo

* Implement settings
* Add event listeners
* Add color schemes
* Implement IRC features

## Screenshot

![Screenshot](https://github.com/rigor789/Rirc/raw/master/screenshot.png "Rirc - an IRC client by rigor789")

## Disclaimer

This application is in it's very early stages; it is far from being ready for use! It is full of sample data, and no real functionality behind it. **When being run, it currently connects to irc.esper.net #rirc!**

## Contributing

If you wish to contribute to the project, fork this repository, and submit Pull Requests!

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
