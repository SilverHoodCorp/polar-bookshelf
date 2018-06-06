
module.exports.TextHighlightController = class {

    constructor(textHighlighter) {
        this.textHighlighter = textHighlighter;
    }

    keyBindingListener(event) {

        if (event.ctrlKey && event.altKey) {

            const tCode = 84;

            switch (event.which) {

                case tCode:
                    this.textHighlighter.doHighlight();
                    break;

                default:
                    break;

            }

        }

    }

    listenForKeyBindings() {
        document.addEventListener("keyup", this.keyBindingListener.bind(this));
    }


}
