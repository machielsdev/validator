import { ValidationElement } from './ValidationElement';

export type Rule = {
    /**
     * Returns whether the rule passed with the given element(s)
     */
    passed(elements: ValidationElement[], ...args: string[]): boolean;
    /**
     * Message shown when the rule doesn't pass
     */
    message(): string;
}
