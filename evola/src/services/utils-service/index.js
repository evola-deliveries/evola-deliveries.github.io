const service = {
    clipboardCopy(text) {
        navigator.clipboard.writeText(text);
    }
};

export default service;