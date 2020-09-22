import React from 'react';
import { mount } from 'enzyme';
import { ValidatorArea, ValidatorAreaProps } from '@/components/ValidatorArea';
import min from '@/rules/min';
import { Validator } from '@/Validator';

describe('test min rule', () => {
    Validator.extend('min', min);
    it('should falsely validate input', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="min:5">
                <input name="test" />
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('Test should be at least 5');
    });

    it('should falsely validate textarea', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="min:5">
                <textarea name="test" />
            </ValidatorArea>
        );

        area.find('textarea').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('Test should be at least 5');
    });

    it('should falsely validate select', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="min:5">
                <select name="test">
                    <option value="">Choose...</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        expect(area.state().errors.length).toBe(1);
        expect(area.state().errors[0]).toBe('Test should be at least 5');
    });

    it('should truly validate select', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="min:5">
                <select name="test">
                    <option value={5}>Choose...</option>
                </select>
            </ValidatorArea>
        );

        area.find('select').simulate('blur');
        expect(area.state().errors.length).toBe(0);
    });
});
