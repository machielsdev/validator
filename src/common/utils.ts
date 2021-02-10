/**
 * Return the given string with an uppercase first letter
 */
const capitalize = (value: string): string => {
    return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1);
}

/**
 * Checks whether the given value is numeric
 */
const isNumeric = (value: string): boolean => {
    return !isNaN(+value);
}

const arraysEqual = (first: any[], second: any[]): boolean => {
    if (first.length !== second.length) {
        return false;
    }

    let i = first.length;

    while (i--) {
        const indexInSecond = second.findIndex((entry: any) => entry === first[i]);

        if (indexInSecond !== -1) {
            second.splice(indexInSecond, 1);
        } else {
            return false;
        }

        first.splice(i, 1);
    }

    return first.length === 0 && second.length === 0;
}

export {
    capitalize,
    isNumeric,
    arraysEqual
}
