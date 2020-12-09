import { Rule } from '../src/Rule';
import { Validator } from '@/Validator';

describe('test validator', () => {
    beforeEach(() => {
        Validator.extend('rule_one', {
            passed(): boolean {
                return false;
            },
            message(): string {
                return 'rule one not passed'
            }
        });

        Validator.extend('rule_two', {
            passed(): boolean {
                return false;
            },
            message(): string {
                return 'rule two not passed'
            }
        });

        Validator.extend('rule_with_params', {
            passed(): boolean {
                return false;
            },
            message(): string {
                return 'rule params not passed: {0}, {1}, {2}, {3}'
            }
        });
    });

    it('should add custom rules', () => {
        const rule: Rule = {
            passed(): boolean {
                return true;
            },
            message(): string {
                return '';
            }
        }

        Validator.extend('testRule', rule);

        expect(Validator.ruleExists('testRule')).toBeTruthy();
    });

    it('should validate rules as string', () => {
        const input = document.createElement<'input'>('input');
        input.value = 'test';

        const validator = new Validator(
            [
                input
            ],
            'rule_one|rule_two',
            'test'
        );

        validator.validate();
        expect(validator.getErrors().length).toBe(2);
    });

    it('should validate rules as array', () => {
        const input = document.createElement<'input'>('input');
        input.value = 'test';
        const validator = new Validator(
            [
                input
            ],
            ['rule_one', 'rule_two'],
            'test'
        );

        validator.validate();
        expect(validator.getErrors().length).toBe(2);
    });

    it('should validate with parameters', () => {
        const input = document.createElement<'input'>('input');
        input.value = 'test';

        const validator = new Validator(
            [
                input
            ],
            ['rule_with_params:1,2,3,4'],
            'test'
        );

        validator.validate();
        expect(validator.getErrors()[0]).toBe('Rule params not passed: 1, 2, 3, 4');
    });

    it('throws an exception when rule is not found', () => {
        const input = document.createElement<'input'>('input');
        input.value = 'test';
        const throws = () => {
            const validator = new Validator(
                [
                    input
                ],
                ['not_existing_rule'],
                'test'
            );
            validator.validate();
        }

        expect(() => throws()).toThrowError('Validation rule not_existing_rule not found.');
    });

    it('should merge rules', () => {
        const rules = Validator.mergeRules(['rule_one', 'rule_two'], 'rule_tree|rule_four', ['rule_five|rule_six']);
        expect(rules.length).toBe(6);
    });

    it('should throw an error when trying to get area when not in area', () => {
        const throws = () => {
            const validator = new Validator(
                [
                    document.createElement<'input'>('input')
                ],
                [],
                'test'
            );
            validator.getArea();
        }

        expect(() => throws()).toThrowError('Areas are only available when validating React components.')
    });

    it('should be able to check if the value is required', () => {
        const input = document.createElement<'input'>('input');
        input.value = 'test';
        Validator.extend('check_if_required', (validator: Validator) => ({
            passed(elements: HTMLElement[]): boolean {
                return !elements.every((element: HTMLElement) => validator.shouldValidate(element));
            },
            message(): string {
                return 'Value is false negative required'
            }
        }));

        const validator = new Validator(
            [
                input
            ],
            ['required', 'check_if_required'],
            'test'
        );

        validator.validate();

        expect(validator.getErrors()[0]).toBe('Value is false negative required');
    })

    it('should return empty array when no refs provided', () => {

    })
});
