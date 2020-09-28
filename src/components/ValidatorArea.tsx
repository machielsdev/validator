import * as React from 'react';
import { isFragment } from 'react-is';
import { RuleOptions } from '@/RuleOptions';
import { AreaScope } from '@/AreaScope';
import { ValidatorContext } from '@/ValidatorContext';
import { Validator } from '@/Validator';

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
    ref: React.RefObject<HTMLElement>;
}

export class ValidatorArea extends React.Component<ValidatorAreaProps, ValidatorAreaState> {
    /**
     * @inheritDoc
     */
    public static contextType = ValidatorContext;

    /**
     * @inheritDoc
     */
    public context!: React.ContextType<typeof ValidatorContext>;

    /**
     * References to elements within the area to be validated
     */
    private inputRefs: HTMLElement[] = [];

    /**
     * Indicates whether the area is dirty
     */
    private dirty = false;

    /**
     * @inheritDoc
     */
    public readonly state: ValidatorAreaState = {
        errors: []
    }

    /**
     * Default props when not provided in the component
     */
    public static defaultProps: Partial<ValidatorAreaProps> = {
        rules: []
    }

    /**
     * @inheritDoc
     */
    public componentDidMount(): void {
        const { addArea } = this.context;

        addArea(this.getName(), this);
    }

    /**
     * Validate the area, or a given element when provided
     */
    public validate(ref?: HTMLElement): Promise<boolean> {
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
                validator.setArea(this);

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
    public getInputRefs(): HTMLElement[] {
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
                        let ref: HTMLElement;

                        return React.cloneElement<ValidatorAreaComponentsProps>(child, {
                            ...child.props,
                            onBlur: (): void => {
                                if (child.props.onBlur) {
                                    child.props.onBlur();
                                }

                                if (this.elementCanBlur(child)) {
                                    this.validate(ref);
                                }
                            },
                            ref: (node: HTMLElement) => {
                                if (node && !this.inputRefs.includes(node)) {
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

    private elementCanBlur(node: React.ReactElement): boolean {
        return node.type === 'input' || node.type === 'textarea' || node.type === 'select';
    }

    /**
     * Indicates whether the node is validatable
     */
    private isValidatableNode(node: React.ReactElement): boolean {
        return typeof node.type === 'string'
            && Validator.VALIDATABLE_ELEMENTS.indexOf(node.type) !== -1;
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

        if (typeof children === 'function') {
            children = (children as (scope: AreaScope) => React.ReactNode)(
                this.getScopedProperties()
            );
        }

        return this.prepareInputs(children);
    }
}
