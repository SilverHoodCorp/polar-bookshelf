/**
 * The range within a page that a pagemark covers.  The range has a start and
 * end which are percentages of the page that a pagemark covers.
 *
 * A default pagemark (for the entire page) would have a range interval of:
 *
 * [0,100]
 *
 *
 * A range for a page that is half way completed is [0,50]
 *
 * Ranges provide additional functionality where we can start the pagemark
 * other than at the top of the page. For example, if you wanted to mark the
 * bottom 50% of the page as read, you could create the pagemark as:
 *
 * [50,100].
 *
 * The user can create pagemarks at any point and then we create a small
 * pagemark anchored to that spot, and give it a bit of height so that the user
 * can visually see it.
 *
 */
module.exports.PagemarkRange = class {

    constructor(start, end) {

        /**
         * The start point of the pagerank range.
         */
        this.start = start;

        /**
         * The end point of the pagerank range.
         */
        this.end = end;

    }

};
