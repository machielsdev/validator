import React from 'react';
import { mount } from 'enzyme';
import required from '@/rules/required';
import { ValidatorAreaProps, ValidatorArea } from '@/components/ValidatorArea';
import { Validator } from '@/Validator';

describe('test required rule', () => {
    beforeEach(() => {
        Validator.extend('required', required);
    });

    it('should falsely validate select with options', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="required">
                <select name="test">
                    <option value="">Choose...</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('Test is required');
    });

    it('should always validate inputs and not validate non-inputs', () => {
        const validator_input = new Validator([
            document.createElement('input')
        ],
        ['required'],
        'validator_input');

        const validator_progress = new Validator([
            document.createElement('progress')
        ],
        ['required'],
        'validate_progress');

        validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(0);
    });
});
