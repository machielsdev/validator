import { Validator, ValidatorProviderProps, ValidatorProviderState } from '../../../src';
import React from 'react';
import same from '../../../src/rules/same';
import { mount } from 'enzyme';
import { ValidatorArea, ValidatorProvider } from '../../../src';
import tick from '../../common/tick';

describe('test same rule', () => {
    beforeEach(() => {
        Validator.extend('same', same);
    });

    it('should validate true', async () => {
        const area = mount<ValidatorProvider, ValidatorProviderProps, ValidatorProviderState>(
            <ValidatorProvider>
                <ValidatorArea rules="same:bar">
                    <input value="foo" name="foo" />
                </ValidatorArea>

                <ValidatorArea validationName="test">
                    <input value="foo" name="bar" />
                </ValidatorArea>
            </ValidatorProvider>
        );

        await area.instance().validate();
        await tick();
        expect(area.state().valid).toBeTruthy();
    });

    it('should validate false', async () => {
        const area = mount<ValidatorProvider, ValidatorProviderProps, ValidatorProviderState>(
            <ValidatorProvider>
                <ValidatorArea rules="same:bar">
                    <input value="foo" name="foo" />
                </ValidatorArea>

                <ValidatorArea>
                    <input value="baz" name="bar" />
                </ValidatorArea>
            </ValidatorProvider>
        );

        await area.instance().validate();
        await tick();
        console.log(area.find(ValidatorArea).first().state());
        expect(area.state().valid).toBeFalsy();
    });
})
