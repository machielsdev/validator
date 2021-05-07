import React from 'react';
import { mount } from 'enzyme';
import {
    Validator,
    ValidatorArea,
    IncorrectArgumentTypeError,
    ValidatorAreaProps,
    maxLength
} from '../../../src';
import tick from '../../common/tick';

describe('test max length rule', () => {
    beforeEach(() => {
        Validator.extend('maxLength', maxLength);
    });

    it('should always validate inputs and not validate non-inputs', async () => {
        const input1 = document.createElement('input');
        const input2 = document.createElement('input');
        const canvas = document.createElement('canvas');
        input1.value = 'foo';
        input2.value = 'foobar';

        const validator_input_correct = new Validator([
            input1
        ],
        ['maxLength:6'],
        '');

        const validator_input_incorrect = new Validator([
            input2
        ],
        ['maxLength:4'],
        '');

        const validator_canvas = new Validator([
            canvas
        ],
        ['maxLength:3'],
        '');

        const validator_wrong_arg = new Validator([
            input1
        ],
        ['maxLength:foo'],
        '');

        await validator_input_incorrect.validate();
        expect(validator_input_incorrect.getErrors().length).toBe(1);

        await validator_input_correct.validate();
        expect(validator_input_correct.getErrors().length).toBe(0);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);

        await expect( validator_wrong_arg.validate()).rejects.toBeInstanceOf(IncorrectArgumentTypeError);
    });

    it('should validate select', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="maxLength:5">
                <select name="test">
                    <option value="Testlong" selected>Option</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        await tick();
        expect(area.state().errors.length).toBe(1);
    });
});
