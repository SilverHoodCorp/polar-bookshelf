
# Features

- different 'types' of pagemarks including "ignore" and "read" types so that
  you can mark an entire page as ignore and still have that count towards 100%

- checkpoint journaling so I have confidence that I am not losing data.

# Release

- disable the PDF.js file upload button

- I don't think I can open up a second file.

- make sure the most recent state of the pagemarks are written to disk

- I need a way to get end to end testing done so that I'm not constantly
  tripping over the same bugs.  For example, opening up existing files from disk,
  closing them, making sure the content is persisted and comes back after reload,
  etc.

- file associations working for *.pdf with elecron-builder

- screenshot and video of the app

- Screenshots with pagemarks.

- Blog / post about it.
    - get links everywhere...

- Actual packages (install on my MacOS box)

- Ability to disable PDF links as they would impact our ability to annotate but
  maybe they have to click the annotation button (highlight, highlight region)
  so that the links are then disabled.


- FONTS look like complete shit compared to the official version!!!
    - is this cmaaps?
    - my local pdf.js build looks horrible too.
    - this might only be on chrome, not in electron

- NOW the thumbnaails look like shit too!!!
    - this might only be on chrome, not in electron

# v1.1

- some sort of tab support working so I can edit muliple PDF files in the UI


- Fix blob loading. This comes up when either:



    - Loading the SECOND file (after loading the first)

    - Attempting to open files in the pulldown that were loaded over HTTP.

    - this is an ELECTRON specific issue.  Chrome does not have this problem.

    Uncaught (in promise) DOMException: Failed to execute 'postMessage' on 'Worker': Error: Protocol "blob:" not supported. Expected "https:" could not be cloned.
        at O.postMessage (file:///home/burton/projects/polar-bookshelf/pdfviewer/web/pdf.viewer.js:1:15528)
        at l (file:///home/burton/projects/polar-bookshelf/pdfviewer/web/pdf.viewer.js:1:12217)
        at file:///home/burton/projects/polar-bookshelf/pdfviewer/web/pdf.viewer.js:1:13060
        at <anonymous>
    pdf.viewer.js:1 Uncaught (in promise) Error: An error occurred while loading the PDF.
        at pdf.viewer.js:1
        at <anonymous>

    - Loading from file URLs won't work because PDF.js forces you to use HTTP or
      HTTPS...

      - What I could do is DISABLE the PDF.js file browse dialog.. and make
        pdf.js work via HTTP the ENTIRE time by :
            - using its own file picker
            - taking that file, giving it a unique ID, then serving it via HTTP
              via /files/{id}

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

- change REMOVE to ERASE to avoid confusion with 'read'
