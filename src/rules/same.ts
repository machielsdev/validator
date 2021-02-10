import {
    getValue,
} from '../common/dom';
import { Validator } from '../Validator';
import { arraysEqual } from '../common/utils';

export default(validator: Validator)  => ({
    passed(elements: HTMLElement[], name: string): boolean {
        const values = elements.reduce((prev: string[], element: HTMLElement) => ([
            ...prev,
            ...getValue(element)
        ]), []);

        const otherValues = validator.refs(name).reduce((prev: string[], element: HTMLElement) => ([
            ...prev,
            ...getValue(element)
        ]), []);

        return arraysEqual(values, otherValues);
    },
    message(): string {
        return 'minLength';
    }
});
