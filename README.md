<img src="https://github.com/burtonator/polar-bookshelf/blob/master/icon.ico" width="80">&nbsp;&nbsp;Polar Bookshelf
==========

Polar Bookshelf is a PDF manager created using [Electron
framework](https://electron.atom.io) and
[PDF.js](https://mozilla.github.io/pdf.js) with added support for incremental
reading, pagemarks, and progress tracking.

Pagemarks are a new proof of concept reading style inspired from [incremental
reading](https://en.wikipedia.org/wiki/Incremental_reading).  Essentially they
allow suspend and resume of reading for weeks and months in the future until
you're ready to resume, without losing your place.  This works even if you
jump around in a book (which is often in technical or research work).

# Roadmap

The long term goal is to implement the following functionality:

 - Automatic metadata extraction of thumbnails, marked up text, and notes and
   support migration into 3rd party spaced repetition systems like Anki.

    - We have a proof of concept of this using chrome headless which needs to be
      ported here.

    - Integration of https://github.com/burtonator/pdf-annotation-exporter to
      enable this functionality.

 - Additional annotation types like area highlight, text highlight, plus a
   complex feature set like notes and tags for these objects.

 - Flashcards will be notes designed and marked specifically to be converted
   to flashcards for usage in spaced repitition systems.  They will have extended
   metadata including front and back of the card as well as support for cloze
   deletions, and the ability to include extended metadata like the source text
   to which the flashcard was attached.

# Principles

We believe the following design principles are core to seeing this as a
successful project.

- All the data should support long term file formats.  The on disk format we
  use is JSON.

- Portability to all platforms is critical. We're initially targeting Linux (Ubuntu),
  MacOS, and Windows.  You shouldn't have to pick a tool, which you might be
  using for the next 5-10 years, and then get stuck to a platform which may
  or may not exist in the future.

# Usage

We currently only support pagemarks but this is the main functionality I wanted
implemented.

The pagemarks are persisted on disk in your ```~/~.polar``` directory and when
you re-open a PDF your pagemarks are restored.

Additionally there is a progress bar that tracks the progress of the document
based on the number of pagemarks you've created.

Right now usage is only via keyboard bindings (for pagemarks).

## Linux / Windows key bindings

 - Control Alt N - create a new pagemark on the current page
 - Control Alt click - create a pagemark on the page up until the current mouse click
 - Control Alt E - erase the current pagemark

## MacOS Key bindings

 - Meta-Command N - create a new pagemark on the current page
 - Meta-Command click - create a pagemark on the page up until the current mouse click
 - Meta-Command E - erase the current pagemark

# Installation

<!-- Download executable jar from [Releases](https://github.com/praharshjain/Electron-PDF-Viewer/releases) -->

## Binaries

We're working on binaries for all platforms.

## Build from source

Install dependencies (Node.js, npm etc) -

```
Install NodeJS and npm for your platform.
```

### To run:

```
$ git clone https://github.com/burtonator/polar-bookshelf
$ cd Electron-PDF-Viewer
$ npm install && npm start
```

### Run with advanced logging:

./node_modules/.bin/electron --enable-remote-debugging --interactive --enable-console-logging .

Screenshot
----------------
<img src="https://github.com/burtonator/polar-bookshelf/blob/master/screenshot.png" width="1200">

License
----------------
[PDF.js](https://github.com/mozilla/pdf.js) is available under  Apache License.
[Electron](https://github.com/electron/electron) is released under MIT License.
Rest of the code is MIT licensed.

<div>Icons made by <a href="https://www.flaticon.com/authors/popcorns-arts" title="Icon Pond">Icon Pond</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
