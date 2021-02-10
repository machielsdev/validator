import {
    getValue,
    isInputElement,
    isSelectElement
} from '../common/dom';
import { isNumeric } from '../common/utils';
import { IncorrectArgumentTypeError } from './IncorrectArgumentTypeError';

export default {
    passed(elements: HTMLElement[], minLength: string): boolean {
        if (!isNumeric(minLength)) {
            throw new IncorrectArgumentTypeError(`minLength rule has incorrect argument ${minLength}. Expected a number.`);
        }

        return elements.every((element: HTMLElement) => {
            if (
                isInputElement(element)
                || isSelectElement(element)
            ) {
                const value = getValue(element);

                return value.every((val: string) => val.length >= Number(minLength));
            }

            return true;
        })
    },
    message(): string {
        return 'minLength';
    }
};