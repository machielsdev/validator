import * as React from 'react';
import { isFragment } from 'react-is';
import { isEqual } from 'lodash';
import { RuleOptions } from '../RuleOptions';
import { AreaScope } from '../AreaScope';
import { ValidatorContext } from '../ValidatorContext';
import { Validator } from '../Validator';

export interface ValidatorAreaProps {
    rules?: RuleOptions;
    name?: string;
    errors?: string[];
    children: React.ReactNode | ((scope: AreaScope) => React.ReactNode);
    validationName?: string;
}

export interface ValidatorAreaPropsWithDefault extends ValidatorAreaProps {
    rules: RuleOptions;
}

export interface ValidatorAreaState {
    errors: string[];
    valid: boolean;
    pending: boolean;
    dirty: boolean;
    touched: boolean;
}

interface ValidatorAreaComponentsProps {
    onBlur: (event: React.FocusEvent) => void;
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
     * @inheritDoc
     */
    public readonly state: ValidatorAreaState = {
        errors: [],
        valid: false,
        pending: false,
        dirty: false,
        touched: false
    }

    /**
     * Default props when not provided in the component
     */
    public static defaultProps: Partial<ValidatorAreaProps> = {
        rules: []
    }

    public constructor(props: ValidatorAreaProps) {
        super(props);

        if (props.errors) {
            this.state.errors = props.errors;
            this.state.valid = false;
        }
    }

    /**
     * @inheritDoc
     */
    public componentDidMount(): void {
        const { addArea } = this.context;

        addArea(this.getName(), this);
    }

    public componentDidUpdate(prevProps: Readonly<ValidatorAreaProps>): void {
        if (this.props.errors && this.props.errors.length) {
            if (!prevProps.errors) {
                this.setErrorsFromProps(this.props.errors);
            } else if (prevProps.errors.length && !isEqual(prevProps.errors, this.props.errors)) {
                this.setErrorsFromProps(this.props.errors);
            }
        }
    }

    /**
     * Sets the errors given via props in the indicated area
     */
    private setErrorsFromProps(errors: string[]): void {
        this.setState((prevState: ValidatorAreaState) => ({
            errors: [...prevState.errors, ...errors],
            valid: false
        }));
    }

    /**
     * Validate the area, or a given element when provided
     */
    public validate(ref?: HTMLElement): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.setState(() => ({
                valid: false,
                errors: [],
                pending: true
            }), () => {
                const {
                    rules: propRules,
                    validationName
                } = this.props as ValidatorAreaPropsWithDefault;
                const { rules: contextRules } = this.context;
                const rules = Validator.mergeRules(propRules, contextRules);
                const refs = ref ? [ref] : this.inputRefs;

                const validator = (new Validator(
                    refs,
                    rules,
                    ref ? ref.getAttribute('name') : this.getName(),
                    validationName
                )).setArea(this);

                validator.validate().then((passed: boolean): void => {
                    if (!passed) {
                        this.setState({
                            errors: validator.getErrors(),
                            valid: false,
                            pending: false
                        }, (): void => {
                            resolve(false);
                        })
                    } else {
                        this.setState({
                            pending: false,
                            valid: true
                        }, () => {
                            resolve(true);
                        })
                    }
                }).catch((e): void => {
                    this.setState({
                        pending: false
                    }, () => {
                        console.error(e);
                    })
                });
            });
        })
    }

    /**
     * Adds errors to the currently existing errors in state
     */
    public addErrors(errors: string[]): void {
        this.setState((prevState: ValidatorAreaState) => ({
            ...prevState,
            errors: [...prevState.errors, ...errors],
            valid: false,

        }));
    }

    /**
     * Gets the name of the area
     */
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
                            onBlur: (event: React.FocusEvent): void => {
                                if (child.props.onBlur) {
                                    child.props.onBlur(event);
                                }

                                this.setState({
                                    touched: true
                                }, () => {
                                    if (this.elementCanBlur(child)) {
                                        this.validate(ref);
                                    }
                                });
                            },
                            onChange: (event: React.ChangeEvent): void => {
                                if (child.props.onChange) {
                                    child.props.onChange(event);
                                }

                                this.setState({
                                    dirty: true
                                })
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

    /**
     * Indicates whether the given node is an element that is a "blurrable" type
     */
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
        const {
            errors,
            valid,
            pending,
            dirty,
            touched
        } = this.state;

        return {
            errors,
            valid,
            pending,
            dirty,
            touched
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
