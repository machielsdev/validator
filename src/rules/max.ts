import { isNumeric } from '@/utils/utils';
import { IncorrectArgumentTypeError } from '@/rules/IncorrectArgumentTypeError';
import { getValue, isInputElement, isSelectElement } from '@/utils/dom';

export default {
    passed(elements: HTMLElement[], max: string): boolean {
        if (!isNumeric(max)) {
            throw new IncorrectArgumentTypeError(`max rule has incorrect argument ${max}. Expected a number.`);
        }

        return elements.every((element: HTMLElement) => {
            if (isInputElement(element) || isSelectElement(element)) {
                const value = getValue(element);

                if (Array.isArray(value)) {
                    return value.every((val: string) => {
                        return isNumeric(val) && parseFloat(val) <= parseFloat(max);
                    });
                } else {
                    return value
                        && isNumeric(value)
                        && parseFloat(value) <= parseFloat(max);
                }
            }

            return true;
        })
    },
    message(): string {
        return `{name} should be not greater than {0}`
    }
}
