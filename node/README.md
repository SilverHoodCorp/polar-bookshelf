#

Custom Webserver which serves both the app locally but also serves up PDFs on
the local filesystem. Chrome can not reliably serve file URLs with pdf.js.

Sometimes it works and sometimes it does not.  Also CMAPs need to run over HTTP.

The way we do this is that when the user opens the file in the UI, we create a
SHA3 hashcode for the path.

Then we register a handler in the HTTP server to:

/files/[sha3]

then we load that in pdf.js via http://localhost

this way we can serve pdf.js via HTTP but also serve the files via HTTP and
the entire thing feels like a seemless webapp.
