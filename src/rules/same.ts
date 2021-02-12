import {
    getValue,
} from '../common/dom';
import { Validator } from '../Validator';
import { arraysEqual } from '../common/utils';
import { RuleObject } from '../Rule';

export default(validator: Validator): RuleObject => ({
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
    messageArgs(): string[] {
        return [
            'fooo'
        ];
    },
    message(): string {
        return 'same';
    }
});
