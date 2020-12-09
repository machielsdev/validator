/**
 * Returns whether element is an input element
 */
const isInputElement = (element: HTMLElement): element is HTMLInputElement|HTMLTextAreaElement => {
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
}

/**
 * Returns whether element is an audio element
 */
const isAudioElement = (element: HTMLElement): element is HTMLAudioElement => {
    return element instanceof HTMLAudioElement;
}

/**
 * Returns whether element is a meter element
 */
const isMeterElement = (element: HTMLElement): element is HTMLMeterElement => {
    return element instanceof HTMLMeterElement;
}
/**
 * Returns whether element is an output element
 */
const isOutputElement = (element: HTMLElement): element is HTMLOutputElement => {
    return element instanceof HTMLOutputElement;
}

/**
 * Returns whether element is an select element
 */
const isSelectElement = (element: HTMLElement): element is HTMLSelectElement => {
    return element instanceof HTMLSelectElement
}

/**
 * Returns whether element is a progress element
 */
const isProgressElement = (element: HTMLElement): element is HTMLProgressElement => {
    return element instanceof HTMLProgressElement;
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
    if (
        isInputElement(element)
        || isMeterElement(element)
        || isOutputElement(element)
        || isOutputElement(element)
        || isProgressElement(element)
    ) {
        return [(element.value || '').toString()].filter(Boolean);
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
    isAudioElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    htmlCollectionToArray,
    getValue,
};
