import {
    createIntl,
    createIntlCache,
    IntlCache,
    IntlShape
} from '@formatjs/intl'
import { Rule, RuleFunction, RuleObject } from '@/Rule';
import { ValidationElement } from '@/ValidationElement';
import { RuleOptions } from '@/RuleOptions';
import { capitalize } from '@/utils/utils';
import { ValidatorArea } from '@/components/ValidatorArea';

export class Validator {
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
    private readonly name: string | null;

    /**
     * Intl cache to prevent memory leaks
     */
    private readonly intlCache: IntlCache;

    /**
     * Intl constructor to localize messages
     */
    private intl: IntlShape<string>;

    /**
     * Validator area used to access other areas and the provider
     */
    private area?: ValidatorArea;

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
     * Indicated whether a given rule name is a rule function
     */
    private static isRuleFunction(rule: string): boolean {
        return typeof Validator.rules[rule] === 'function';
    }

    /**
     * Validate a specific rule
     */
    private validateRule(rule: string): boolean {
        const [ruleName, ruleArgs = ''] = rule.split(':');
        if (Validator.hasRule(ruleName)) {
            const ruleObj: RuleObject = Validator.isRuleFunction(ruleName)
                ? (Validator.rules[ruleName] as RuleFunction)(this) : Validator.rules[ruleName] as RuleObject;

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
     * Sets the current area
     */
    public setArea(area: ValidatorArea): Validator {
        this.area = area;

        return this;
    }

    /**
     * Gets the area where this validator instance is used
     */
    public getArea(): ValidatorArea {
        if (this.area) {
            return this.area;
        }

        throw new Error('Areas are only available when validating React components.');
    }

    /**
     * Gets a list of validation element refs, optionally specified by area name
     */
    public refs(name?: string): ValidationElement[] {
        return this.getArea().context.getRefs(name);
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
     * Check whether the validator has a rule
     */
    public static hasRule(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(Validator.rules, name);
    }
}
