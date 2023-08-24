var randomNumberGenerator = function () {
    var values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] / 4294967295;
};
export default randomNumberGenerator;
