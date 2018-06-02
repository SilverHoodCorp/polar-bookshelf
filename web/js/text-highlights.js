// code for dealing with text highlights

// given some text, compute a list of rects that can overlap the text to form
// one coherent highlight.
function computeRectsForContiguousHighlightRegion(boundingClientRects) {

    let tuples = createSiblingTuples(boundingClientRects);

    let result = [];

    tuples.forEach(function (tuple) {

        var adjusted = {};
        Object.assign(adjusted, tuple.curr);

        if(tuple.next) {
            adjusted.bottom = tuple.next.top;
        }

        result.push(adjusted);

    })

    return result;

}
