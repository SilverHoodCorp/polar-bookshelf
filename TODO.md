- ability to disable PDF links as they would impact our ability to annotate but
  maybe they have to click the annotation button (highlight, highlight region)
  so that the links are then disabled.

- get chrome dev tools to work

    app.commandLine.appendSwitch('remote-debugging-port', '8315');
    app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1');

- take the filename on the command line

- keep a history of recently opened files

- actual packages (install on my MacOS box)

- manage basic page marks

-  cmaps are disabled when loading from file URLs so I need to look into this
   problem and this might cause problems with some PDFs.


- learn how to re-draw the page so that just the canvas BACKGROUND is grey.
  We have to re-draw the entire page because if we just replace the white
  characters we could mutate a figure or some other part of the graphic.  the
  best way to do this would be to inject some code into the pdf.js page
  rendering.
