import {
    getValue,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '@/common/dom';

export default {
    passed(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            if (
                isInputElement(element)
                || isSelectElement(element)
                || isMeterElement(element)
                || isOutputElement(element)
                || isProgressElement(element)
            ) {
                const value = getValue(element).filter(Boolean);

                return value.length;
            }

            return true;
        })
    },

    message(): string {
        return `{name} is required`;
    }
};
