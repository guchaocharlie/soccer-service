const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
};

const random = (array) => {
    const length = array.length;
    for (let i = 0; i < length - 1 ; i++) {
        const ii = Math.floor(getRandomArbitrary(i, length));
        const temp = array[i];
        array[i] = array[ii];
        array[ii] = temp;
    }

    const middle = Math.ceil(length / 2);

    return {
        array1: array.slice(0,middle),
        array2: array.slice(middle)
    }
};

module.exports = {
    random,
};