
# Editor.md

Definitely works in the browser...

http://localhost:63342/polar-bookshelf/editor.md/examples/use-requirejs.html?_ijt=42focdo4mf4dkoauntsuhrdo8i

# SimpleMD

- I cna listen to the generated HTML ...


	var sideBySideRenderingFunction = function() {
		preview.innerHTML = editor.options.previewRender(editor.value(), preview);
	};

	if(!cm.sideBySideRenderingFunction) {
		cm.sideBySideRenderingFunction = sideBySideRenderingFunction;
	}

	if(useSideBySideListener) {
		preview.innerHTML = editor.options.previewRender(editor.value(), preview);
		cm.on("update", cm.sideBySideRenderingFunction);
	} else {
		cm.off("update", cm.sideBySideRenderingFunction);
	}

	// Refresh to fix selection being off (#309)
	cm.refresh();
