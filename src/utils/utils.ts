/**
 * Return the given string with an uppercase first letter
 */
export const capitalize = (value: string): string => {
    return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1);
}
