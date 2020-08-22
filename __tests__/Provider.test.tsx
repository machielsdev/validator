import React from 'react';
import { mount } from 'enzyme';
import { ValidatorArea, ValidatorProvider } from '../src';
import required from '../src/rules/required';
import { ValidatorProviderProps } from '../src/Provider';

describe('test Provider', () => {
    it('should render Provider perfectly', () => {
        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules={[required]} />
        );

        expect(provider.instance().props.rules).toBeDefined();
    });

    it('should render with function as child', () => {
        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider>
                {() => <div>test</div>}
            </ValidatorProvider>
        );

        expect(provider.find('div').text()).toBe('test');
    })

    it('should add an area when provided as child', () => {
        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider>
                <ValidatorArea name="test">
                    <div />
                </ValidatorArea>
            </ValidatorProvider>
        );

        const areas = provider.state().areas;

        expect(areas.test).toBeDefined();
        expect(areas.test).toBeInstanceOf(ValidatorArea);
    })
})
