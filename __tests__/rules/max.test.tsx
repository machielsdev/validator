import React from 'react';
import { mount } from 'enzyme';
import max from '@/rules/max';
import { Validator } from '@/Validator';
import { ValidatorArea, ValidatorAreaProps } from '@/components/ValidatorArea';
import { IncorrectArgumentTypeError } from '@/rules';

describe('test max rule', () => {
    beforeEach(() => {
        Validator.extend('max', max);
    });

    it('should always validate inputs and not validate non-inputs', () => {
        const input = document.createElement('input');
        const meter = document.createElement('meter');
        const output = document.createElement('output');
        const progress = document.createElement('progress');
        const canvas = document.createElement('canvas');
        input.value = '7';
        output.value = '7';
        meter.value = 6;
        meter.max = 10;
        progress.value = 6;

        const validator_input = new Validator([
            input
        ],
        ['max:5'],
        '');

        const validator_meter = new Validator([
            meter
        ],
        ['max:5'],
        '');

        const validator_output = new Validator([
            output
        ],
        ['max:5'],
        '');

        const validator_progress = new Validator([
            progress
        ],
        ['max:5'],
        '');

        const validator_canvas = new Validator([
            canvas
        ],
        ['max:5'],
        '');

        const validator_wrong_arg = new Validator([
            input
        ],
        ['max:foo'],
        '');

        validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        validator_meter.validate();
        expect(validator_meter.getErrors().length).toBe(1);

        validator_output.validate();
        expect(validator_output.getErrors().length).toBe(1);

        validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(1);

        validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);

        const throwsInvalidArgument = () => {
            validator_wrong_arg.validate();
        }

        expect(() => throwsInvalidArgument()).toThrowError(IncorrectArgumentTypeError);
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
