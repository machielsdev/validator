import React from 'react';
import { mount } from 'enzyme';
import required from '@/rules/required';
import { ValidatorAreaProps, ValidatorArea } from '@/components/ValidatorArea';
import { Validator } from '@/Validator';
import tick from '../../common/tick';

describe('test required rule', () => {
    beforeEach(() => {
        Validator.extend('required', required);
    });

    it('should falsely validate select with options', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="required">
                <select name="test">
                    <option value="">Choose...</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        await tick();
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('Test is required');
    });

    it('should always validate validatable and not validate non-validatable', async () => {
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

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_meter.validate();
        expect(validator_meter.getErrors().length).toBe(1);

        await validator_output.validate();
        expect(validator_output.getErrors().length).toBe(1);

        await validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(1);

        await validator_div.validate();
        expect(validator_div.getErrors().length).toBe(0);
    });
});
