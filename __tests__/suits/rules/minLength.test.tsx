import React from 'react';
import { mount } from 'enzyme';
import {
    Validator,
    ValidatorArea,
    IncorrectArgumentTypeError,
    ValidatorAreaProps
} from '../../../src';
import tick from '../../common/tick';
import minLength from '../../../src/rules/minLength';

describe('test min length rule', () => {
    beforeEach(() => {
        Validator.extend('minLength', minLength);
    });

    it('should always validate inputs and not validate non-inputs', async () => {
        const input = document.createElement('input');
        const canvas = document.createElement('canvas');
        input.value = 'foo';

        const validator_input = new Validator([
            input
        ],
        ['minLength:4'],
        '');

        const validator_canvas = new Validator([
            canvas
        ],
        ['minLength:3'],
        '');

        const validator_wrong_arg = new Validator([
            input
        ],
        ['minLength:foo'],
        '');

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);

        await expect( validator_wrong_arg.validate()).rejects.toBeInstanceOf(IncorrectArgumentTypeError);
    });

    it('should validate select', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="minLength:5">
                <select name="test">
                    <option value="Test" selected>Option</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        await tick();
        expect(area.state().errors.length).toBe(1);
    });
});
