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

    it('should always validate validatable and not validate non-validatable', () => {
        const input = document.createElement('input');
        const meter = document.createElement('meter');
        const output = document.createElement('output');
        const progress = document.createElement('progress');
        const div = document.createElement('div');

        const validator_input = new Validator([
            input
        ],
        ['required'],
        'validator_input');

        const validator_meter = new Validator([
            meter
        ],
        ['required'],
        'validator_input');

        const validator_output = new Validator([
            output
        ],
        ['required'],
        'validator_input');

        const validator_progress = new Validator([
            progress
        ],
        ['required'],
        'validator_input');

        const validator_div = new Validator([
            div
        ],
        ['required'],
        'validator_input');

        validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        validator_meter.validate();
        expect(validator_meter.getErrors().length).toBe(1);

        validator_output.validate();
        expect(validator_output.getErrors().length).toBe(1);

        validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(1);

        validator_div.validate();
        expect(validator_div.getErrors().length).toBe(0);
    });
});
