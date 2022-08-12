expect.extend({
    toContainNTimes(received, search, times) {
        const regex = new RegExp(search, "g");
        if ((received.match(regex) || []).length === times) {
            return {
                pass: true,
                message: () => "Expected " + received + " not to contain '" + search + "' " + times + " times",
            };
        } else {
            return {
                pass: false,
                message: () => "Expected " + received + " to contain '" + search + "' " + times + " times",
            };
        }
    },
});
