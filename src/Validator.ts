import {
    createIntl,
    createIntlCache,
    IntlCache,
    IntlShape
} from '@formatjs/intl';
import { Rule, RuleFunction, RuleObject } from './Rule';
import { RuleOptions } from './RuleOptions';
import { ValidatorArea } from './components/ValidatorArea';
import required from './rules/required';
import { getValue, isCanvasElement } from './common/dom';
import { LocaleMessagesMap } from './LocaleMessages';
import { capitalize } from './common/utils';
import en from './locale/en';

export class Validator {
    public static VALIDATABLE_ELEMENTS: string[] = [
        'canvas', 'input', 'meter', 'select', 'textarea', 'output', 'progress'
    ];

    /**
     * Map containing the rule object belonging to a rule string
     */
    public static rules: Record<string, Rule> = {
        required
    };

    /**
     * The elements to be validated
     */
    private readonly elements: HTMLElement[];

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

    /**
     * Name used to overwrite name attribute, to allow messages to be more specific
     */
    private validationName?: string;

    /**
     * The active locale
     */
    private static locale = 'en';

    /**
     * Map with messages keyed with locales, containing EN as default
     */
    private static messages: LocaleMessagesMap = en;

    public constructor(
        elements: HTMLElement[],
        rules: RuleOptions,
        name: string | null,
        validationName?: string
    ) {
        this.elements = elements;
        this.validationRules = rules;
        this.name = name;
        this.validationName = validationName;

        this.intlCache = createIntlCache();
        this.intl = this.createIntl();
    }

    /**
     * Creates a new intl instance
     */
    private createIntl(): IntlShape<string> {
        return createIntl({
            locale: Validator.locale,
            messages: Validator.messages[Validator.locale]
        }, this.intlCache);
    }

    /**
     * Get the rule list as array
     */
    private getRuleList(): string[] {
        if (typeof this.validationRules === 'string') {
            return this.validationRules.split('|');
        }

        return this.validationRules;
    }

    public hasRule(rule: string): boolean {
        return this.getRuleList().indexOf(rule) !== -1;
    }

    /**
     * Validate the elements
     */
    public async validate(): Promise<boolean> {
        this.errors = [];

        if (this.hasValidatableElements()) {
            return !(await Promise.all(this.getRuleList().map((rule: string) => this.validateRule(rule))))
                .filter((passed: boolean) => !passed)
                .length;
        }

        return true;
    }

    /**
     * Indicated whether a given rule name is a rule function
     */
    private static isRuleFunction(rule: string): boolean {
        return typeof Validator.rules[rule] === 'function';
    }

    /**
     * Get the rule name and the parameters as tuple
     */
    private static getRuleNameAndParameters(rule: string): [string, string[]] {
        const [name, ...splittedParameters] = rule.split(':');
        const parameters = splittedParameters.join(':');

        if (['regex'].indexOf(name) !== -1) {
            return [name, [parameters]];
        }

        return [name, parameters.split(',')];
    }

    /**
     * Validate a specific rule
     */
    private async validateRule(rule: string): Promise<boolean> {
        const [ruleName, ruleParameters] = Validator.getRuleNameAndParameters(rule);

        if (Validator.ruleExists(ruleName)) {
            const ruleObj: RuleObject = Validator.isRuleFunction(ruleName)
                ? (Validator.rules[ruleName] as RuleFunction)(this)
                : Validator.rules[ruleName] as RuleObject;

            const passed = await ruleObj.passed(this.elements, ...ruleParameters);

            if(!passed) {
                this.errors.push(this.localize(ruleObj.message(), ...ruleParameters));
                return false;
            }

            return true;
        }

        throw new Error(`Validation rule ${rule} not found.`);
    }

    public hasValidatableElements(): boolean {
        return this.elements.some((element: HTMLElement) => this.shouldValidate(element));
    }

    public shouldValidate(element: HTMLElement): boolean {
        if (this.hasRule('required')) {
            return true;
        }

        return !!(getValue(element).length
            || isCanvasElement(element)
        );
    }

    /*
     * Get the capitalized, localized message
     */
    public localize(message: string, ...ruleArgs: string[]): string {
        return capitalize(this.intl.formatMessage({
            id: message,
            defaultMessage: message
        }, {
            name: this.validationName || this.name,
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
    public refs(name?: string, type?: typeof HTMLElement): HTMLElement[] {
        return this.getArea().context.getRefs(name, type);
    }

    /**
     * Merges rules from different sources into one array
     */
    public static mergeRules(...rules: RuleOptions[]): string[] {
        let mergedRules: string[] = [];
        rules.forEach((rule: string | string[]) => {
            if (typeof rule === 'string') {
                rule.split('|').forEach((subRule) => mergedRules.push(subRule));
            } else if (Array.isArray(rule) && rule.length) {
                mergedRules = [...mergedRules, ...rule];
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
    public static ruleExists(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(Validator.rules, name);
    }

    public static hasLocale(locale: string): boolean {
        return !!Object.prototype.hasOwnProperty.call(Validator.messages, locale);
    }

    /**
     * Adds a locale map to the messages map, keyed by locale
     */
    public static addLocale(messages: LocaleMessagesMap): void {
        Validator.messages = {
            ...Validator.messages,
            ...messages
        };
    }

    /**
     * Sets the given locale for all the new created validator instance or defaults to English if the locale does not
     * exist
     */
    public static setLocale(locale: string, messages?: LocaleMessagesMap): void {
        if (!messages) {
            if (Validator.hasLocale(locale)) {
                Validator.locale = locale;
            } else {
                Validator.locale = 'en';
            }
        } else {
            Validator.addLocale(messages);
            Validator.setLocale(locale);
        }
    }
}
