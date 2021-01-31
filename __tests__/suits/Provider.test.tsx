import React from 'react';
import { mount } from 'enzyme';
import { Validator } from '@/Validator';
import ValidatorProvider, { ValidatorProviderProps } from '@/components/ValidatorProvider';
import { ValidatorArea } from '@/components/ValidatorArea';
import tick from '../common/tick';

describe('test ValidatorProvider', () => {
    beforeEach(() => {
        Validator.extend('passes_not', {
            passed(): boolean {
                return false;
            },
            message(): string {
                return 'not passed';
            }
        });

        Validator.extend('passes', {
            passed(): boolean {
                return true;
            },
            message(): string {
                return 'passed';
            }
        });
    });

    it('should render ValidatorProvider', () => {
        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules="passes_not" />
        );

        expect(provider.instance().props.rules).toBeDefined();
    });

    it('should throw error when area with existing name is added', () => {
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
    });

    it('should render with function as child', () => {
        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider>
                {() => <div>test</div>}
            </ValidatorProvider>
        );

        expect(provider.find('div').text()).toBe('test');
    });

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
                        <ValidatorArea rules="passes_not" name="test1">
                            <input value="test" />
                        </ValidatorArea>
                        <ValidatorArea rules="passes_not" name="test2">
                            <input value="test" />
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
                        <ValidatorArea rules="passes" name="test1">
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
    });

    it('should indicate whether the area is dirty', async () => {
        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider>
                {({ dirty }) => (
                    <>
                        <ValidatorArea name="test1" rules="required">
                            <input value="1" />
                        </ValidatorArea>
                        <div>{dirty ? 'yes' : 'no'}</div>
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('input').at(0).simulate('blur');
        await tick();
        expect(provider.find('div').text()).toBe('no');

    })
})
