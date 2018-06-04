
export class PagemarkCoverageEventListener {

    constructor(controller) {
        this.controller = controller;
        this.keyActivated = true;
    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    keyListener(event) {
        //
        // if(!event) {
        //     throw new Error("no event");
        // }
        //
        // if (event.ctrlKey && event.altKey) {
        //
        //     const eCode = 69;
        //
        //     switch (event.which) {
        //
        //         case eCode:
        //
        //             this.keyActivated = true;
        //             break;
        //
        //         default:
        //
        //             this.keyActivated = false;
        //             break;
        //
        //     }
        //
        // }

    }

    mouseListener(event) {

        if(!event) {
            throw new Error("no event");
        }

        if(!this.keyActivated) {
            return;
        }

        this.onActivated(event);

    }


    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    onActivated(event) {

        console.log("ACTIVATED");

        var element = document.getElementById("status");

        var pageElement = this.controller.getCurrentPageElement();

        console.log("FIXME: pageElement: ", pageElement);
        console.log("FIXME: event.target: ", event.target);
        console.log("FIXME: event.pageY", event.pageY);

        var pageOffset = OffsetCalculator.calculate(pageElement, document);

        console.log("FIXME: pageOffset", JSON.stringify(pageOffset, null, "  "));


        // console.log("FIXME: ", document.body.scrollTop);
        //
        // var height = Styles.parsePixels(pageElement.style.height);
        //
        // // FIXME offsetY is in the element hosting the event.. not the main element
        // // we're looking for.
        //
        // var x = (event.pageX ) + document.body.scrollLeft;
        // var y = (event.pageY ) + document.body.scrollTop;
        //
        // console.log(`x: ${x} y" ${y}`)
        //
        // var percentage = (event.offsetY / height) * 100;
        //
        // console.log("FIXME percentage", percentage );


    }

    startListening() {
        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));
        document.addEventListener("click", this.mouseListener.bind(this));
    }

}
