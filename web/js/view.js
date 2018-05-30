class View {

    constructor(model) {
        this.model = model;
    }

}



class WebView extends View {

    constructor(model) {
        super(model);

        this.model.registerListenerForMarkPageRead(this.onMarkPageRead.bind(this));

    }

    onMarkPageRead(event) {

        console.log("View updating on page mark read.");

    }

}
