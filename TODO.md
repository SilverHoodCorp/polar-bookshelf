
# Features

- different 'types' of pagemarks including "ignore" and "read" types so that
  you can mark an entire page as ignore and still have that count towards 100%

- checkpoint journaling so I have confidence that I am not losing data.

# Release (for myself)

## Required editor functionality

- paste images / screenshots from clipboard and save as data URL.
 - https://stackoverflow.com/questions/28644340/how-do-i-get-base64-encoded-image-from-clipboard-in-internet-explorer
 - https://matthewmoisen.com/blog/paste-js-example/

 - I can detect the paste, then convert what's pasted to a data URL, then change
   the CSS it so that the user doesn't need to deal with the full thing.

## Next

- ability to right click and 'add flashcard' to an annotation and enter the data
  in markdown.



- recent files

    - https://github.com/electron/electron/blob/master/docs/tutorial/recent-documents.md

    - https://github.com/electron/electron/issues/4028

    - https://www.npmjs.com/package/electron-config


- offset each new window from the previous one. It's not clear that a window
  was actually opened.

    https://stackoverflow.com/questions/46949194/new-window-positioning-in-electron

- 'open-file' event for mac and windows?


- get text extraction working for annotations
    - I sort of need this working since we're capturing the data now but I
      imagine I could build this into the future.

- get end to end tests working

- get the transaction logs working

- get basic flashcards working so that I can easily create them.  Don't focus
  on tags or any other functionality. Just notes.

    - work on this as a dedicated app for now.

-  webview.openDevTools();
    - support...


# Spectron Testing

## Test for:

- re-use of main app when second app attempt requested
- loading PDF file from command line:
    - with no app running
    - with existing app running


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


- get webapp testing working

- get end to end testing with pdf.js working

# Marketing

- (pending) pdf.js
- anki forum
- /r/medicalschool group...
- electronjs group
- other spaced repitition groups
- (done) /r/adhd
- (done) anki reddit
- (done) news.ycombinator

# Cleanup


- TODO: don't use the minified version of the app.  It makes it harder to work with.

- take a filename on the command line

- keep a history of recently opened files


- I could use chrome headless via fork() to print my own PDFs of URLs within
  electron since I'm running in the OS as a top level project.

    - this would give me the ability to import a specific URL or to send a URL
      from chrome to polar.

- change REMOVE to ERASE to avoid confusion with 'read'




