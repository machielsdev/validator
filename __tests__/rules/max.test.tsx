import React from 'react';
import { mount } from 'enzyme';
import max from '@/rules/max';
import { Validator } from '@/Validator';
import { ValidatorArea, ValidatorAreaProps } from '@/components/ValidatorArea';

describe('test max rule', () => {
    beforeEach(() => {
        Validator.extend('max', max);
    });

    it('should always validate inputs and not validate non-inputs', () => {
        const input = document.createElement('input');
        input.value = '5';

        const throwsArgumentError = () => {
            const validator = new Validator([
                input
            ], ['max:foo'],
            'validate_throws'
            );
            validator.validate();
        }

        const validator_input = new Validator([
            input
        ],
        ['max:4'],
        'validator_input');

        const progress = document.createElement('progress');
        progress.value = 5;

        const validator_progress = new Validator([
            progress
        ],
        ['max:4'],
        'validate_progress');

        expect(() => throwsArgumentError()).toThrowError('max rule has incorrect argument foo. Expected a number.')

        validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(0);
    });

    it('should validate select', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="max:3">
                <select name="test">
                    <option value="4" selected>Option</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        expect(area.state().errors.length).toBe(1);
    });
});
