
- persist + restore to disk

- actual packages (install on my MacOS box)

- change the page marks to light blue.


- ability to disable PDF links as they would impact our ability to annotate but
  maybe they have to click the annotation button (highlight, highlight region)
  so that the links are then disabled.

- TODO: don't use the minified version of the app.  It makes it harder to work with.

- take the filename on the command line

- keep a history of recently opened files


-  cmaps are disabled when loading from file URLs so I need to look into this
   problem and this might cause problems with some PDFs.

- learn how to re-draw the page so that just the canvas BACKGROUND is grey.
  We have to re-draw the entire page because if we just replace the white
  characters we could mutate a figure or some other part of the graphic.  the
  best way to do this would be to inject some code into the pdf.js page
  rendering.

- I could use chrome headless via fork() to print my own PDFs of URLs within
  electron since I'm running in the OS as a top level project.

    - this would give me the ability to import a specific URL or to send a URL
      from chrome to polar.
