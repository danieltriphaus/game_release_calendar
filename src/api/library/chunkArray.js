/**
 * @module chunkArray
 */

/**
 * Splits an array into multiple chunks
 * @param {Array} inputArray
 * @param {number} size
 * @returns {Array[]}
 */
export const chunkArray = (inputArray, size) => {
    let result;
    if (size === 0) {
        result = inputArray;
    } else {
        result = inputArray.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / size);

            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = []; // start a new chunk
            }

            resultArray[chunkIndex].push(item);

            return resultArray;
        }, []);
    }
    return result;
};