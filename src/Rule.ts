import { Validator } from '@/Validator';
import { ValidationElement } from '@/ValidationElement';

/**
 * Function to access validator using the rule
 */
export type RuleFunction = (validator: Validator) => RuleObject;

/**
 * Object structure rules must implement
 */
export type RuleObject = {
    /**
     * Returns whether the rule passed with the given element(s)
     */
    passed(elements: ValidationElement[], ...args: string[]): boolean;
    /**
     * Message shown when the rule doesn't pass
     */
    message(): string;
}

export type Rule = RuleObject | RuleFunction;
