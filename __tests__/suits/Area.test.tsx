import React from 'react';
import { mount } from 'enzyme';
import { Validator } from '@/Validator';
import { ValidatorArea, ValidatorAreaProps } from '@/components/ValidatorArea';
import ValidatorProvider, { ValidatorProviderProps } from '@/components/ValidatorProvider';
import { ProviderScope } from '@/ProviderScope';
import required from '@/rules/required';
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
        Validator.extend('required', required);

        Validator.extend('long_wait', {
            async passed(): Promise<boolean> {
                return new Promise((resolve: (value: boolean) => void): void => {
                    setTimeout(() => {
                        resolve(true);
                    }, 100);
                })
            },
            message(): string {
                return 'test';
            }
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render input', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea>
                <input name="test"/>
            </ValidatorArea>
        );

        expect(area.find('input')).toBeDefined();
    });

    it('should render inputs with callback as child', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea>
                {() => (
                    <input name="test"/>
                )}
            </ValidatorArea>
        );

        expect(area.find('input')).toBeDefined();
    })

    it('should throw an exception when no name provided', () => {
        const area = () => {
            mount<ValidatorArea, ValidatorAreaProps>(
                <ValidatorArea>
                    {() => (
                        <>
                            <input/>
                            <input/>
                        </>
                    )}
                </ValidatorArea>
            );
        }
        expect(() => area()).toThrow();
    });

    it('should index (nested) inputs', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea name="test">
                {() => (
                    <>
                        <><input/></>
                        <div>
                            <input/>
                            <input/>
                            <><input/></>
                        </div>
                    </>
                )}
            </ValidatorArea>
        );

        expect(area.instance().getInputRefs().length).toBe(4);
    });

    it('should apply rules on blur', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                <input name="test" value="test"/>
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('blur');
        await tick();
        expect(area.state().errors[0]).toBe('Not passed');
    });

    it('should not apply rules on blur when non-blurrable element', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not" name="test">
                <canvas/>
            </ValidatorArea>
        );

        area.find('canvas').at(0).simulate('blur');
        expect(area.state().errors.length).toBe(0);
    });

    it('should render error when area dirty', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                {({errors}) => {
                    return (
                        <>
                            <input name="test" value="test"/>
                            {!!errors.length && <div>{errors[0]}</div>}
                        </>
                    );
                }}
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        await tick();
        area.update();
        expect(area.find('div').text()).toBe('Not passed');
    })

    it('should call element\'s provided blur along validator blur', () => {
        const mockFn = jest.fn();

        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                <input name="test" onBlur={mockFn} value="test"/>
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(mockFn).toBeCalled();
    });

    it('should call element\'s provided onChange along validator onChange', () => {
        const mockFn = jest.fn();

        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                <input name="test" onChange={mockFn} value="test"/>
            </ValidatorArea>
        );

        area.find('input').simulate('change');
        expect(mockFn).toBeCalled();
    });

    it('should get all input refs from the provider', async () => {
        Validator.extend('test_all', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs().length === 2;
            },
            message(): string {
                return '';
            }
        }))
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules="test_all">
                {({validate}: ProviderScope) => (
                    <>
                        <ValidatorArea name="test1">
                            <input value="test"/>
                        </ValidatorArea>
                        <ValidatorArea>
                            <input value="test" name="test2"/>
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)}/>
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled()
    });

    it('should get spcific input refs from the provider', async () => {
        Validator.extend('test_specific', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs('test1').length === 2
                    && validator.refs('test2').length === 1;
            },
            message(): string {
                return 'test';
            }
        }))
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules="test_specific">
                {({validate}: ProviderScope) => (
                    <>
                        <ValidatorArea name="test1">
                            <input value="test"/>
                            <input value="test"/>
                        </ValidatorArea>
                        <ValidatorArea>
                            <input value="test" name="test2"/>
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)}/>
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled()
    });

    it('should return empty array when undefined area name is fetched', async () => {
        Validator.extend('test_not_existing', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs('not_existing').length === 0;
            },
            message(): string {
                return 'test';
            }
        }))
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules="test_not_existing">
                {({validate}: ProviderScope) => (
                    <>
                        <ValidatorArea name="test1">
                            <input value="test"/>
                        </ValidatorArea>
                        <ValidatorArea>
                            <input value="test" name="test2"/>
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)}/>
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled();
    });

    it('should not be able to get all refs when not wrapped in provider', () => {
        Validator.extend('no_other_areas', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs('not_existing').length === 0
                    && validator.refs().length === 0;
            },
            message(): string {
                return 'test';
            }
        }))
        const mockFn = jest.fn();

        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="no_other_areas">
                <input name="test" value="test" onBlur={mockFn}/>
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(mockFn).toBeCalled();
    });

    it('should get refs by type', async () => {
        Validator.extend('test_types', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs(undefined, HTMLInputElement).length === 1
                    && validator.refs('test1', HTMLTextAreaElement).length === 1
                    && validator.refs('test1').length === 1
                    && validator.refs('test1', HTMLProgressElement).length === 0;
            },
            message(): string {
                return 'test';
            }
        }))
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules="test_types">
                {({validate}: ProviderScope) => (
                    <>
                        <ValidatorArea name="test1">
                            <textarea value="test"/>
                        </ValidatorArea>
                        <ValidatorArea>
                            <input value="test" name="test2"/>
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)}/>
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled();
    });

    it('should use validation name when provided', async () => {
        Validator.extend('passes_not', {
            passed(): boolean {
                return false;
            },
            message(): string {
                return '{name} not passed';
            }
        });

        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea validationName="Foo" rules="passes_not">
                <input name="test" value="test"/>
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('blur');
        await tick();
        expect(area.state().errors[0]).toBe('Foo not passed');
    });

    it('should log error when error occured', async () => {
        const logFn = jest.spyOn(console, 'error');
        const area = mount(
            <ValidatorArea rules="min:foo">
                <input name="test" value="test"/>
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('blur');
        await tick();
        expect(logFn).toHaveBeenCalled();
    });

    it('should indicate whether the area is valid', async () => {
        const area = mount(
            <ValidatorArea rules="required">
                {({valid}) => (
                    <>
                        <input name="test" value="test" />
                        <div>{valid ? 'yes' : 'no'}</div>
                    </>
                )}
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('blur');
        await tick();
        expect(area.find('div').text()).toBe('yes');
    });

    it('should indicate pending while validation is ongoing', async () => {
        jest.useFakeTimers();

        const area = mount(
            <ValidatorArea rules="long_wait">
                {({pending}) => (
                    <>
                        <input name="test" value=""/>
                        <div>{pending ? 'yes' : 'no'}</div>
                    </>
                )}
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('blur');
        jest.advanceTimersByTime(90);
        expect(area.find('div').text()).toBe('yes');
        await Promise.resolve();
        jest.advanceTimersByTime(10);
        await Promise.resolve();
        expect(area.find('div').text()).toBe('no');
    });

    it('should indicate dirty when input changed', async () => {
        const area = mount(
            <ValidatorArea>
                {({dirty}) => (
                    <>
                        <input name="test" value=""/>
                        <div>{dirty ? 'yes' : 'no'}</div>
                    </>
                )}
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('change', { target: { value: 'a' } });
        await tick();
        expect(area.find('div').text()).toBe('yes')
    });

    it('should indicate touched when input blurred', async () => {
        const area = mount(
            <ValidatorArea rules="required">
                {({touched}) => (
                    <>
                        <input name="test" value=""/>
                        <div>{touched ? 'yes' : 'no'}</div>
                    </>
                )}
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('blur');
        await tick();
        expect(area.find('div').text()).toBe('yes')
    });

    it('should set errors in areas from props and change over time', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea name="test" errors={['test error']}>
                <input value="" />
            </ValidatorArea>
        );

        expect(area.state().errors.length).toBe(1);
        area.setProps({ errors: ['test error 2']});
        expect(area.state().errors.length).toBe(2);
    });

    it('should set errors from props', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea name="test">
                <input value="" />
            </ValidatorArea>
        );

        area.setProps({ errors: ['test error'] });
        expect(area.state().errors.length).toBe(1);
    });
})
