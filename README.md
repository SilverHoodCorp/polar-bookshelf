<img src="https://github.com/burtonator/polar-bookshelf/blob/master/icon.ico" width="40">&nbsp;&nbsp;Polar Bookshelf
==========

PDF viewer created using [Electron framework](https://electron.atom.io) and
[PDF.js](https://mozilla.github.io/pdf.js) with added support for incremental
reading, pagemarks, and progress tracking.

Pagemarks are a new proof of concept reading style inspired from [incremental
reading](https://en.wikipedia.org/wiki/Incremental_reading).  Essentially they
allow suspend and resume of reading weeks and months in the future.

# Roadmap

The long term goal is to implement the following functionality:

 - automatic metadata extraction of thumbnails, marked up text, and notes and
   support migration into 3rd party spaced repetition systems like Anki.

    - integration of https://github.com/burtonator/pdf-annotation-exporter to
      enable this functionality.

 - additional annotation types like area highlight, text highlight, plus a
   complex feature set like notes and tags for these objects.

Usage
----------------

<!-- Download executable jar from [Releases](https://github.com/praharshjain/Electron-PDF-Viewer/releases) -->

Or build from source :

Install dependencies (Node.js, npm etc) -
```
$ sudo apt-get install python-software-properties
$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
$ sudo apt-get update
$ sudo apt-get install build-essential
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```
To run -
```
$ git clone https://github.com/burtonator/polar-bookshelf
$ cd Electron-PDF-Viewer
$ npm install && npm start
```
Screenshot
----------------
<img src="https://github.com/burtonator/polar-bookshelf/blob/master/screenshot.png" width="1200">

License
----------------
[PDF.js](https://github.com/mozilla/pdf.js) is available under  Apache License.
[Electron](https://github.com/electron/electron) is released under MIT License.  
Rest of the code is MIT licensed.

<div>Icons made by <a href="https://www.flaticon.com/authors/popcorns-arts" title="Icon Pond">Icon Pond</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
