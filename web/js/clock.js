class Clock {

    /**
     * @return a new Date object representing the current time.
     */
    getDate() {

    }

}

class SystemClock extends Clock {

    getDate() {
        return new Date();
    }

}

class SyntheticClock extends Clock {

    getDate() {
        return new Date(Date.parse("2018-05-30T02:47:44.411Z"));
    }

}

console.log("FIXME: OK.. clocks defined")
