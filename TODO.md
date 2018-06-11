
# Features

- different 'types' of pagemarks including "ignore" and "read" types so that
  you can mark an entire page as ignore and still have that count towards 100%

- checkpoint journaling so I have confidence that I am not losing data.

# Release (for myself)

## Next

- recent files and 'open-file' even for mac and windows.

    - https://github.com/electron/electron/blob/master/docs/tutorial/recent-documents.md

    - https://github.com/electron/electron/issues/4028

    - https://www.npmjs.com/package/electron-config

- open in new window

- ability to right click and 'add flashcard' to an annotation...

- get text extraction working
    - I sort of need this working since
- get end to end tests working
- get the transaction logs working

- get basic flashcards working so that I can easily create them.  Don't focus
  on tags or any other functionality. Just notes.

    - work on this as a dedicated app for now.

-  webview.openDevTools();
    - support...


### Windows Build

- https://github.com/electron-userland/electron-builder/blob/master/docs/multi-platform-build.md#docker

## Site

- screenshot and video of the app

- Screenshots with pagemarks.

- Blog / post about it.

# Beta 9

- clean up excessive dependencies.

- file associations working for *.pdf with elecron-builder.
    - Not critical right now.

- Ability to disable PDF links as they would impact our ability to annotate but
  maybe they have to click the annotation button (highlight, highlight region)
  so that the links are then disabled.

- basic logging of renderer console data (errors) to the node console.

# v1.0

- I need a way to get end to end testing done so that I'm not constantly
  tripping over the same bugs.  For example, opening up existing files from disk,
  closing them, making sure the content is persisted and comes back after reload,
  etc.

- some sort of tab support working so I can edit muliple PDF files in the UI


- DMG and Linux releases work but:
    - file associations are broken
        - they don't work on MacOS
        - they aren't even present as an option for MacOS

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


- I could use chrome headless via fork() to print my own PDFs of URLs within
  electron since I'm running in the OS as a top level project.

    - this would give me the ability to import a specific URL or to send a URL
      from chrome to polar.

- change REMOVE to ERASE to avoid confusion with 'read'
