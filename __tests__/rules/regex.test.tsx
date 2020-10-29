import { Validator } from '@/Validator';
import { mount } from 'enzyme';
import { ValidatorArea, ValidatorAreaProps } from '@/components/ValidatorArea';
import React from 'react';
import regex from '@/rules/regex';

describe('test regex rule', () => {
    beforeEach(() => {
        Validator.extend('regex', regex);
    });

    it('should always validate inputs and not validate non-inputs', () => {
        const input = document.createElement('input');
        input.value = 'foobar';

        const throwsArgumentError = () => {
            const validator = new Validator([
                    input
                ], ['regex:/[A-Z]/g'],
                'validate_throws'
            );
            validator.validate();
        }

        const validator_input = new Validator([
                input
            ],
            ['min:6'],
            'validator_input');

        const progress = document.createElement('progress');
        progress.value = 5;

        const validator_progress = new Validator([
                progress
            ],
            ['min:4'],
            'validate_progress');

        expect(() => throwsArgumentError()).toThrowError('min rule has incorrect argument foo. Expected a number.')

        validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(0);
    });

    it('should validate select', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="min:5">
                <select name="test">
                    <option value="4" selected>Option</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        expect(area.state().errors.length).toBe(1);
    });
});
