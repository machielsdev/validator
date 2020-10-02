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

export {
    capitalize,
    isNumeric
}
