
- FIXME: I think I need to rethink how I put the page marks on the screen:

     - DO NOT listen to the main events ... I don't think they work the way I
       expect them to work.

     - instead... load the docMeta... then just , if the page elements stay forever,
       just look for the canvas to be there, and paint over it.

     - I just need to redesign it entirely:

        - load the doc meta... then attach listeners to every page which:

            - detect when the canvas loads

            - when the canvas loads, just draw the pagemark... I'm going to need
              to handle the initial state though. That's honestly the
              biggest problem I have...  but I can do that first.

            - update the mock code to create a pagemark for EVERY page so I can
              test how it works in that mode.

            - AHAH!! just write a function that goes through EVERY page, injects
              my annotation manually, and see what happens..  I actually think
              it might not work though because it has to be after the canvas..
              but I could just write my own manual event listener and inject it
              to see what happens.  That is what I will do...  the logic should
              just be always draw it , unless not enabled.


        // pageElement.addEventListener('DOMNodeInserted', function(event) {
        //
        //     if (event.target && event.target.className === "endOfContent") {
        //
        //         console.log("Adding page mark again");
        //
        //         // make sure to first remove all the existing pagemarks if there
        //         // are any
        //         this.erasePagemarks(pageElement);
        //
        //         // we're done all the canvas and text nodes... so place the pagemark
        //         // back in again.
        //
        //         this.createPagemark(pageElement);
        //
        //         // FIXME: this is a bug because I dont' think think I can'
        //
        //         // done listening so remove myself...
        //         pageElement.removeEventListener('DOMNodeInserted', arguments.callee, false);
        //
        //     }
        //
        // }.bind(this), false );




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


- chagge REMOVE to ERASE to avid confusion with 'read'
