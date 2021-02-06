import { Validator } from '@/Validator';
import { mount } from 'enzyme';
import { ValidatorArea, ValidatorAreaProps } from '@/components/ValidatorArea';
import React from 'react';
import regex from '@/rules/regex';
import tick from '../../common/tick';

describe('test regex rule', () => {
    beforeEach(() => {
        Validator.extend('regex', regex);
    });

    it('should always validate inputs and not validate non-inputs', async (): Promise<void> => {
        const input = document.createElement('input');
        const canvas = document.createElement('canvas');
        input.value = 'foo,|bar';

        const validator_input = new Validator([
            input
        ],
        ['regex:(\\w)+,(\\w)+'],
        '');

        const validator_canvas = new Validator([
            canvas
        ],
        ['regex:(\\w)+,(\\w)+'],
        '');

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);
    });

    it('should validate select', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="regex:(\w)+,(\w)+">
                <select name="test">
                    <option value="4" selected>Option</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        await tick();
        expect(area.state().errors.length).toBe(1);
    });
});
