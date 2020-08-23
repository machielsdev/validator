import React from 'react';
import { mount } from 'enzyme';
import { ValidatorArea } from '../../src';
import { ValidatorAreaProps } from '../../src/ValidatorArea';
import max from '../../src/rules/max';

describe('test max rule', () => {
    it('should falsely validate input', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules={[max(5)]}>
                <input name="test" value="6" />
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('Test should be not greater than 5');
    });

    it('should falsely validate textarea', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules={[max(5)]}>
                <textarea name="test" value="6" />
            </ValidatorArea>
        );

        area.find('textarea').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('Test should be not greater than 5');
    });

    it('should falsely validate select', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules={[max(5)]}>
                <select name="test">
                    <option value="">Choose...</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('Test should be not greater than 5');
    });

    it('should truly validate select', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules={[max(5)]}>
                <select name="test">
                    <option value={5}>Choose...</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        expect(area.state().errors.length).toBe(0);
    });
});
