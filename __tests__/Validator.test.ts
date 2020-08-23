import { Rule } from '../src/Rule';
import { Validator } from '../src';

describe('test validator', () => {
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

        expect(Validator.hasRule('testRule')).toBeTruthy();
    });
});
