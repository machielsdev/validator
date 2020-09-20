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

export interface ValidatorAreaPropsWithDefault extends ValidatorAreaProps {
    rules: RuleOptions;
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

    /**
     * Validate the area, or a given element when provided
     */
    public validate(ref?: ValidationElement): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.dirty = false;
            this.setState(() => ({
                errors: []
            }), () => {
                const { rules: propRules } = this.props as ValidatorAreaPropsWithDefault;
                const { rules: contextRules } = this.context;
                const rules = Validator.mergeRules(propRules, contextRules);
                const refs = ref ? [ref] : this.inputRefs;

                const validator = new Validator(
                    refs,
                    rules,
                    ref ? ref.getAttribute('name') : this.getName()
                );

                this.dirty = !validator.validate();

                if (this.dirty) {
                    this.setState({
                        errors: validator.getErrors()
                    }, () => {
                        resolve(false);
                    })
                } else {
                    resolve(true)
                }
            });
        })
    }

    /**
     * @inheritDoc
     */
    public componentDidMount(): void {
        const { addArea } = this.context;

        addArea(this.getName(), this);
    }

    private getName(): string {
        if (this.inputRefs.length === 1 && this.inputRefs[0].getAttribute('name')) {
            return this.inputRefs[0].getAttribute('name') as string;
        }

        const { name } = this.props;

        if (name) {
            return name;
        }

        throw new Error('All input areas should contain either a name prop, or only one input-like with a name prop');
    }

    /**
     * Returns the input references within the area
     */
    public getInputRefs(): ValidationElement[] {
        return this.inputRefs;
    }

    /**
     * Prepare inputs so they can be validated when interacted with
     */
    private prepareInputs(
        children: React.ReactNode
    ): React.ReactNode {
        return React.Children.map<React.ReactNode, React.ReactNode>(
            children,
            (child): React.ReactNode => {
                if (React.isValidElement(child) || isFragment(child)) {
                    if (child.props.children && child.type !== 'select') {
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

                                this.validate(ref);
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

    /**
     * Indicates whether the node is validatable
     */
    private isValidatableNode(node: React.ReactElement): boolean {
        return node.type === 'input' || node.type === 'textarea' || node.type === 'select';
    }

    /**
     * Returns the properties accessible in the area component scope
     */
    private getScopedProperties(): AreaScope {
        const { errors } = this.state;

        return {
            errors
        };
    }

    /**
     * @inheritDoc
     */
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
