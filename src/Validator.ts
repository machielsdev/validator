import { Rule } from './Rule';
import ValidatorProvider from './Provider';
import ValidatorArea from './ValidatorArea';

export class Validator {
    public static rules: Record<string, Rule> = {};

    public static Provider = ValidatorProvider;
    public static Area = ValidatorArea;

    public static extend(name: string, rule: Rule): void {
        Validator.rules[name] = rule;
    }

    public static hasRule(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(Validator.rules, name);
    }
}
