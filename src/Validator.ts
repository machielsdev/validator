import {
    createIntl,
    createIntlCache,
    IntlCache,
    IntlShape
} from '@formatjs/intl'
import { Rule } from './Rule';
import ValidatorProvider from './ValidatorProvider';
import ValidatorArea from './ValidatorArea';
import { ValidationElement } from './ValidationElement';
import { RuleOptions } from './RuleOptions';
import { capitalize } from './utils/utils';

export class Validator {
    /**
     * Area component used as wrapper around input components
     */
    public static Area = ValidatorArea;

    /**
     * Provider component used to validate multiple areas at once
     */
    public static Provider = ValidatorProvider;

    /**
     * Map containing the rule object belonging to a rule string
     */
    public static rules: Record<string, Rule> = {};

    /**
     * The elements to be validated
     */
    private readonly elements: ValidationElement[];

    /**
     * The rules to validate the elements with
     */
    private readonly validationRules: RuleOptions;

    /**
     * Validation errors when elements are invalid
     */
    private errors: string[] = [];

    /**
     * Name used to specify error messages
     */
    private name: string | null;

    /**
     * Intl cache to prevent memory leaks
     */
    private intlCache: IntlCache;

    /**
     * Intl constructor to localize messages
     */
    private intl: IntlShape<string>;

    public constructor(
        elements: ValidationElement[],
        rules: RuleOptions,
        name: string | null,
    ) {
        this.elements = elements;
        this.validationRules = rules;
        this.name = name;

        this.intlCache = createIntlCache();
        this.intl = this.createIntl();
    }

    /**
     * Creates a new intl instance
     */
    private createIntl(): IntlShape<string> {
        return createIntl({
            locale: 'en'
        }, this.intlCache);
    }

    /**
     * Validate the elements
     */
    public validate(): boolean {
        let ruleList: string[];
        this.errors = [];

        if (typeof this.validationRules === 'string') {
            ruleList = this.validationRules.split('|');
        } else {
            ruleList = this.validationRules;
        }

        return !ruleList
            .map((rule: string) => this.validateRule(rule))
            .filter((passed: boolean) => !passed)
            .length;
    }

    /**
     * Validate a specific rule
     */
    private validateRule(rule: string): boolean {
        const [ruleName, ruleArgs = ''] = rule.split(':');
        if (Validator.hasRule(ruleName)) {
            const ruleObj = Validator.rules[ruleName];
            const ruleArgsArray = ruleArgs.split(',');

            if(!ruleObj.passed(this.elements, ...ruleArgsArray)) {
                this.errors.push(this.localize(ruleObj.message(), ...ruleArgsArray));
                return false;
            }

            return true;
        }

        throw new Error(`Validation rule ${rule} not found.`);
    }

    /*
     * Get the capitalized, localized message
     */
    public localize(message: string, ...ruleArgs: string[]): string {
        return capitalize(this.intl.formatMessage({
            id: message,
            defaultMessage: message
        }, {
            name: this.name,
            ...ruleArgs
        }));
    }

    /**
     * Get all the errors
     */
    public getErrors(): string[] {
        return this.errors;
    }

    /**
     * Merges rules from different sources into one array
     */
    public static mergeRules(...rules: RuleOptions[]): string[] {
        const mergedRules: string[] = [];
        rules.forEach((rule: string | string[]) => {
            if (typeof rule === 'string') {
                rule.split('|').forEach((subRule) => mergedRules.push(subRule));
            } else if (Array.isArray(rule) && rule.length) {
                Validator.mergeRules(...rule).forEach((subRule) => mergedRules.push(subRule));
            }
        });

        return mergedRules;
    }

    /**
     * Extend the validator with a new rule
     */
    public static extend(name: string, rule: Rule): void {
        Validator.rules[name] = rule;
    }

    /**
     * Chech whether the validator has a rule
     */
    public static hasRule(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(Validator.rules, name);
    }
}
