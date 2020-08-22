import * as React from 'react';
import { isFragment } from 'react-is';
import { RuleOptions } from './RuleOptions';
import { ValidatorContext } from './ValidatorContext';
import { ValidationElement } from './ValidationElement';
import { AreaScope } from './AreaScope';
import { Validator } from './Validator';

export interface ValidatorAreaProps {
    rules?: RuleOptions;
    name?: string;
    children: React.ReactNode | ((scope: AreaScope) => React.ReactNode);
}

interface ValidatorAreaState {
    errors: string[];
}

interface ValidatorAreaComponentsProps {
    onBlur: () => void;
    ref: React.RefObject<ValidationElement>;
}

class ValidatorArea extends React.Component<ValidatorAreaProps, ValidatorAreaState> {
    public static contextType = ValidatorContext;
    public context!: React.ContextType<typeof ValidatorContext>;
    private inputRefs: ValidationElement[] = [];
    private dirty = false;

    public readonly state: ValidatorAreaState = {
        errors: []
    }

    public static defaultProps: Partial<ValidatorAreaProps> = {
        rules: []
    }

    public validate(ref?: ValidationElement): boolean {
        this.dirty = false;
        this.setState(() => ({
            errors: []
        }), () => {
            const refs = ref ? [ref] : this.inputRefs;
            const { rules: propRules = [] } = this.props;
            const { rules: contextRules } = this.context;
            const rules = [...propRules, ...contextRules];
            const messages: string[] = [];

            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                if (typeof rule === 'string' && Validator.hasRule(rule)) {
                    rule = Validator.rules[rule];
                }

                if (!rule.passed(refs)) {
                    messages.push(rule.message(refs));
                    this.dirty = true;
                }
            }

            if (this.dirty) {
                this.setState(() => ({
                    errors: messages
                }));
            }
        });

        return this.dirty;
    }

    public componentDidMount(): void {
        const { addArea } = this.context;

        addArea(this.getName(), this);
    }

    private getName(): string {
        if (this.inputRefs.length === 1) {
            return this.inputRefs[0].getAttribute('name') as string;
        }

        const { name } = this.props;

        if (name) {
            return name;
        }

        throw new Error('All input areas should contain either a name prop, or only one input-like with a name prop');
    }

    public getInputRefs(): ValidationElement[] {
        return this.inputRefs;
    }

    private validateComponent(ref: ValidationElement): void {
        this.validate(ref);
    }

    private prepareInputs(
        children: React.ReactNode
    ): React.ReactNode {
        return React.Children.map<React.ReactNode, React.ReactNode>(
            children,
            (child): React.ReactNode => {
                if (React.isValidElement(child) || isFragment(child)) {
                    if (child.props.children) {
                        return React.cloneElement(
                            child,
                            child.props,
                            this.prepareInputs(child.props.children)
                        );
                    }

                    if (this.isValidatableNode(child)) {
                        let ref: ValidationElement;

                        return React.cloneElement<ValidatorAreaComponentsProps>(child, {
                            ...child.props,
                            onBlur: () => {
                                if (child.props.onBlur) {
                                    child.props.onBlur();
                                }

                                this.validateComponent(ref);
                            },
                            ref: (node: ValidationElement) => {
                                if (node) {
                                    ref = node;
                                    this.inputRefs.push(ref);
                                }
                            }
                        });
                    }
                }

                return child;
            }
        );
    }

    private isValidatableNode(node: React.ReactElement): boolean {
        return node.type === 'input' || node.type === 'textarea';
    }

    private getScopedProperties(): AreaScope {
        const { errors } = this.state;

        return {
            errors
        };
    }

    public render(): React.ReactNode {
        let { children } = this.props;
        this.inputRefs = [];

        if (typeof children === 'function') {
            children = (children as (scope: AreaScope) => React.ReactNode)(
                this.getScopedProperties()
            );
        }

        return this.prepareInputs(children);
    }
}

export default ValidatorArea;
