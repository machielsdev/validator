import {
    getValue,
    isInputElement,
    isSelectElement
} from '../common/dom';
import { isNumeric } from '../common/utils';
import { IncorrectArgumentTypeError } from './IncorrectArgumentTypeError';

export default {
    passed(elements: HTMLElement[], length: string): boolean {
        if (!isNumeric(length)) {
            throw new IncorrectArgumentTypeError(`length rule has incorrect argument ${length}. Expected a number.`);
        }

        return elements.every((element: HTMLElement) => {
            if (
                isInputElement(element)
                || isSelectElement(element)
            ) {
                const value = getValue(element);

                return value.every((val: string) => val.length === Number(length));
            }

            return true;
        })
    },
    message(): string {
        return 'length';
    }
};
