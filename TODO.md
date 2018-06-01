
# Release

- The pagemarks go away if I scroll up too fast. I think it's the issue with the
  docMeta now... maybe?

    - it seems like the internal / backing pagemarks are vanishing!!!

    - getting rid of the 'when necessary' code seems to resolve the problme
      and all the pagemarks are drawn with no issues.

    - write the mutation listener code so I can see when objects / pages are
      changing.

- blog / post about it
    - get links everywhere...

- actual packages (install on my MacOS box)


- different 'types' of pagemarks including "ignore" and "read" types so that
  you can mark an entire page as ignore and still have that count towards 100%

- thumbnails highlighted in the side bar


- ability to disable PDF links as they would impact our ability to annotate but
  maybe they have to click the annotation button (highlight, highlight region)
  so that the links are then disabled.

# Development productivity

- get node.js testing working

- get webapp testing working

- get end to end testing with pdf.js working

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
