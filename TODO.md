
# Features


- different 'types' of pagemarks including "ignore" and "read" types so that
  you can mark an entire page as ignore and still have that count towards 100%

- thumbnails highlighted in the side bar

    - #thumbnailView has N A elements, one per page.
    - with a <div> of .thumbnail with data-page-number on it
    - with a child div of .thumbnailSelectionRing under it
    - I can probably just re-use the existing framework

- checkpoint journaling so I have confidence that I am not losing data.

# Release

- Screenshots with pagemarks.

- Blog / post about it.
    - get links everywhere...

- Actual packages (install on my MacOS box)

- Ability to disable PDF links as they would impact our ability to annotate but
  maybe they have to click the annotation button (highlight, highlight region)
  so that the links are then disabled.

# Development productivity

- get node.js testing working

- get webapp testing working

- get end to end testing with pdf.js working

# Marketing

- pdf.js
- news.ycombinator
- anki forum
- anki reddit
- /r/medicalschool group...
- electronjs group
- /r/adhd
- other spaced repitition groups

# Cleanup


- TODO: don't use the minified version of the app.  It makes it harder to work with.

- take a filename on the command line

- keep a history of recently opened files


-  cmaps are disabled when loading from file URLs so I need to look into this
   problem and this might cause problems with some PDFs.


- I could use chrome headless via fork() to print my own PDFs of URLs within
  electron since I'm running in the OS as a top level project.

    - this would give me the ability to import a specific URL or to send a URL
      from chrome to polar.


- chagge REMOVE to ERASE to avid confusion with 'read'
