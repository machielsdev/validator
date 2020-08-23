import React from 'react';
import { mount } from 'enzyme';
import { ValidatorArea, ValidatorProvider } from '../src';
import required from '../src/rules/required';
import { ValidatorProviderProps } from '../src/Provider';


const tick = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    })
}

describe('test Provider', () => {
    it('should render Provider', () => {
        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules={[required]} />
        );

        expect(provider.instance().props.rules).toBeDefined();
    });

    it('should throw error when area with existing name is addeded', () => {
            const provider = () => {
                mount<ValidatorProvider, ValidatorProviderProps>(
                    <ValidatorProvider>
                        <ValidatorArea name="test">
                            <div />
                        </ValidatorArea>
                        <ValidatorArea name="test">
                            <div />
                        </ValidatorArea>
                    </ValidatorProvider>
                );
            }

            expect(() => provider()).toThrow('Validation area names should be unique');
    })

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

    it('should not call callback when areas dirty', async () => {
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider>
                {({ validate }) => (
                    <>
                        <ValidatorArea rules={[required]} name="test1">
                            <input value="" />
                        </ValidatorArea>
                        <ValidatorArea rules={[required]} name="test2">
                            <input value="" />
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)} />
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).not.toHaveBeenCalled()
    })

    it('should call callback when areas not dirty', async () => {
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider>
                {({ validate }) => (
                    <>
                        <ValidatorArea rules={[required]} name="test1">
                            <input value="foo" />
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)} />
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled()
    })


    it('should just validate when not rules prop is given', async () => {
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider>
                {({ validate }) => (
                    <>
                        <ValidatorArea name="test1">
                            <input value="" />
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)} />
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled()
    })
})
