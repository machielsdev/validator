import { Validator } from './Validator';

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
    passed(elements: HTMLElement[], ...args: string[]): boolean | Promise<boolean>;
    /**
     * Message shown when the rule doesn't pass
     */
    message(): string;
}

export type Rule = RuleObject | RuleFunction;
