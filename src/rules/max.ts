import { isNumeric } from '@/common/utils';
import { IncorrectArgumentTypeError } from '@/rules/IncorrectArgumentTypeError';
import {
    getValue,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '@/common/dom';

export default {
    passed(elements: HTMLElement[], max: string): boolean {
        if (!isNumeric(max)) {
            throw new IncorrectArgumentTypeError(`max rule has incorrect argument ${max}. Expected a number.`);
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
                    return isNumeric(val) && parseFloat(val) <= parseFloat(max);
                });
            }

            return true;
        })
    },
    message(): string {
        return `{name} should be not greater than {0}`
    }
};
