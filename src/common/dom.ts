/**
 * Returns whether element is an input element
 */
const isInputElement = (element: HTMLElement): element is HTMLInputElement => {
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
}

/**
 * Indicates whether element is a radio element
 */
const isRadioElement = (element: HTMLElement): element is HTMLInputElement => {
    return isInputElement(element) && element.type === 'radio';
}

/**
 * Indicates whether element is a checkbox element
 */
const isCheckboxElement = (element: HTMLElement): element is HTMLInputElement => {
    return isInputElement(element) && element.type === 'checkbox';
}

/**
 * Returns whether element is an canvas element
 */
const isCanvasElement = (element: HTMLElement): element is HTMLCanvasElement => {
    return element instanceof HTMLCanvasElement;
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

const nodeListToArray = <T extends Node>(nodeList: NodeListOf<T>): T[] => {
    const array: T[] = [];

    nodeList.forEach((node: T) => {
        array.push(node);
    })

    return array;
}

export {
    isInputElement,
    isRadioElement,
    isSelectElement,
    isCanvasElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isCheckboxElement,
    htmlCollectionToArray,
    getValue,
    nodeListToArray
};
