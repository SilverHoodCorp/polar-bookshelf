
# 1.0.0-beta10

- ability to easily toggle the devtools.

- --enable-dev-tools command line arg for starting with the dev tools already running

# 1.0.0-beta9

- reworked command line handling so that PDFs that are opened from the command
  line are opened in a new window.

- new "Open in New Window" menu option so that we can work with multiple PDF
  files.

# 1.0.0-beta8

- New windows were always maximized which was difficult to work with.

- Support opening multiple windows now.  We were constrained to just one window
  before.

# 1.0.0-beta7

- All PDF files are served via HTTP and webapp served via HTTP too which avoids
  some pdf.js bugs.
