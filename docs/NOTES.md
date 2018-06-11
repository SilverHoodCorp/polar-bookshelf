I can use this to create a right sidebar...

html[dir='ltr'] #outerContainer.sidebarOpen #viewerContainer {
    transition-property: left;
    left: 200px;
    left: var(--sidebar-width);
    right: 200px;


- the sidebar drag thing is doing:

--sidebar-width:264px;"

in <html>.. this is some sort of CSS variable defintion thing.
The actual width it is using is via (var)..

Our bar should be called annbar (annotation bar)
