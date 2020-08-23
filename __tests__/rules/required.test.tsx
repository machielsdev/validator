import React from 'react';
import { mount } from 'enzyme';
import { ValidatorArea } from '../../src';
import { ValidatorAreaProps } from '../../src/ValidatorArea';
import required from '../../src/rules/required';

describe('test required rule', () => {
    it('should validate input', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules={[required]}>
                <input name="test" />
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('This field is required');
    });

    it('should validate textarea', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules={[required]}>
                <textarea name="test" />
            </ValidatorArea>
        );

        area.find('textarea').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('This field is required');
    });

    it('should validate select', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules={[required]}>
                <select name="test">
                    <option value="">Choose...</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('This field is required');
    });
});
