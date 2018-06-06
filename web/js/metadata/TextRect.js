
class TextRect extends SerializedObject {

    constructor(val) {
        super(val);

        // the actual text in this rect.
        this.text = null;

        // A rect area that the user has selected text.
        this.rect = null;

    }

}