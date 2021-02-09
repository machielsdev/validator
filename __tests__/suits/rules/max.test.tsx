import React from 'react';
import { mount } from 'enzyme';
import {
    Validator,
    ValidatorArea,
    ValidatorAreaProps,
    IncorrectArgumentTypeError,
    max
} from '../../../src';
import tick from '../../common/tick';

describe('test max rule', () => {
    beforeEach(() => {
        Validator.extend('max', max);
    });

    it('should always validate inputs and not validate non-inputs', async () => {
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
        progress.max = 10;

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

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_meter.validate();
        expect(validator_meter.getErrors().length).toBe(1);

        await validator_output.validate();
        expect(validator_output.getErrors().length).toBe(1);

        await validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(1);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);

        await expect( validator_wrong_arg.validate()).rejects.toBeInstanceOf(IncorrectArgumentTypeError);
    });

    it('should validate select', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="max:3">
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
