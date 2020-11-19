import { getValue, isInputElement, isSelectElement } from '@/utils/dom';

export default {
    passed(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            if (isInputElement(element) || isSelectElement(element)) {
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
