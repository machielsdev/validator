/**
 * Returns whether element is an input element
 */
const isInputElement = (element: HTMLElement): element is HTMLInputElement => {
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
}

/**
 * Returns whether element is an select element
 */
const isSelectElement = (element: HTMLElement): element is HTMLSelectElement => {
    return element instanceof HTMLSelectElement
}

/**
 * Returns an flexible array representation of an html element collection
 */
const htmlCollectionToArray = <T extends Element>(collection: HTMLCollectionOf<T>): T[] => {
    const arr: T[] = [];

    for(let i = 0; i < collection.length; i++) {
        arr.push(collection.item(i) as T);
    }

    return arr;
}

/**
 * Returns the value of the element, when it exists
 */
const getValue = (element: HTMLElement): string[] => {
    if (isInputElement(element)) {
        return [element.value];
    }

    if (isSelectElement(element)) {
        return htmlCollectionToArray<HTMLOptionElement>(element.selectedOptions)
            .map((option: HTMLOptionElement) => option.value)
            .filter(Boolean);
    }

    return [];
}

export {
    isInputElement,
    isSelectElement,
    htmlCollectionToArray,
    getValue,
};
