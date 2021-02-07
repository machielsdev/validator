import React from 'react';
import { mount } from 'enzyme';
import {
    min,
    Validator,
    ValidatorArea,
    IncorrectArgumentTypeError,
    ValidatorAreaProps
} from '../../../src';
import tick from '../../common/tick';

describe('test min rule', () => {
    beforeEach(() => {
        Validator.extend('min', min);
    });

    it('should always validate inputs and not validate non-inputs', async () => {
        const input = document.createElement('input');
        const meter = document.createElement('meter');
        const output = document.createElement('output');
        const progress = document.createElement('progress');
        const canvas = document.createElement('canvas');
        input.value = '4';
        output.value = '4';
        meter.value = 4;
        meter.max = 10;
        progress.value = 4;

        const validator_input = new Validator([
            input
        ],
        ['min:5'],
        '');

        const validator_meter = new Validator([
            meter
        ],
        ['min:5'],
        '');

        const validator_output = new Validator([
            output
        ],
        ['min:5'],
        '');

        const validator_progress = new Validator([
            progress
        ],
        ['min:5'],
        '');

        const validator_canvas = new Validator([
            canvas
        ],
        ['min:5'],
        '');

        const validator_wrong_arg = new Validator([
            input
        ],
        ['min:foo'],
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
            <ValidatorArea rules="min:5">
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
