import {
    getValue,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '@/common/dom';
import { isNumeric } from '@/common/utils';
import { IncorrectArgumentTypeError } from '@/rules/IncorrectArgumentTypeError';

export default {
    passed(elements: HTMLElement[], min: string): boolean {
        if (!isNumeric(min)) {
            throw new IncorrectArgumentTypeError(`min rule has incorrect argument ${min}. Expected a number.`);
        }

        return elements.every((element: HTMLElement) => {
            if (
                isInputElement(element)
                || isSelectElement(element)
                || isProgressElement(element)
                || isMeterElement(element)
                || isOutputElement(element)
            ) {
                const value = getValue(element);

                return value.every((val: string) => {
                    return isNumeric(val) && parseFloat(val) >= parseFloat(min);
                });
            }

            return true;
        })
    },
    message(): string {
        return `{name} should be at least {0}`
    }
};
