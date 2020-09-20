import React from 'react';
import { mount } from 'enzyme';
import { ValidatorArea, Validator } from '../src';
import { ValidatorAreaProps } from '../src/ValidatorArea';

describe('test Provider', () => {
    beforeEach(() => {
        Validator.extend('passes_not', {
            passed(): boolean {
                return false;
            },
            message(): string {
                return 'not passed';
            }
        });
    });

    it('should render input', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea>
                <input name="test" />
            </ValidatorArea>
        );

        expect(area.find('input')).toBeDefined();
    });

    it('should render inputs with callback as child', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea>
                {() => (
                    <input name="test" />
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
                            <input />
                            <input />
                            <><input/></>
                        </div>
                    </>
                )}
            </ValidatorArea>
        );

        expect(area.instance().getInputRefs().length).toBe(4);
    });

    it('should apply rules on blur', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                <input name="test" />
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('blur');
        expect(area.state().errors[0]).toBe('Not passed');
    });

    it('should render error when area dirty', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                {({ errors }) => (
                    <>
                        <input name="test" />
                        {errors.length && <div>{errors[0]}</div>}
                    </>
                )}
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(area.find('div').text()).toBe('Not passed');
    })

    it('should call element\'s provided blur along validator blur', () => {
        const mockFn = jest.fn();

        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                <input name="test" onBlur={mockFn} />
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(mockFn).toBeCalled();
    });
})
