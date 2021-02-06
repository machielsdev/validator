import * as React from 'react';
import { isEqual } from 'lodash';
import { Messages } from '@/Messages';
import { RuleOptions } from '@/RuleOptions';
import { ProviderScope } from '@/ProviderScope';
import { ValidatorContext } from '@/ValidatorContext';
import { ValidatorArea } from '@/components/ValidatorArea';

export interface ValidatorProviderProps {
    rules?: RuleOptions;
    errors?: Messages;
    children?: React.ReactNode | ((scope: ProviderScope) => React.ReactNode);
}

interface ValidatorProviderState {
    areas: Record<string, ValidatorArea>;
    errors: Messages;
    valid: boolean;
}

export class ValidatorProvider extends React.Component<ValidatorProviderProps, ValidatorProviderState> {
    public readonly state: ValidatorProviderState = {
        areas: {},
        errors: {},
        valid: false
    }

    public constructor(props: ValidatorProviderProps) {
        super(props);

        if (props.errors) {
            this.state.errors = props.errors;
        }
    }

    public componentDidUpdate(
        prevProps: Readonly<ValidatorProviderProps>
    ) {
        if (this.props.errors && Object.keys(this.props.errors).length) {
            if (!prevProps.errors || !Object.keys(prevProps.errors).length) {
                this.setErrorsFromProps(this.props.errors);
            } else if (Object.keys(prevProps.errors).length
                && Object.keys(this.props.errors).length
                && !isEqual(prevProps.errors, this.props.errors)
            ) {
                this.setErrorsFromProps(this.props.errors);
            }
        }
    }

    /**
     * Indicates whether an area exists with the given name
     */
    private hasArea(name: string): boolean {
        return !!Object.prototype.hasOwnProperty.call(this.state.areas, name);
    }

    /**
     * Sets the errors given via props in the indicated area
     */
    private setErrorsFromProps(errors: Messages): void {
        Object.keys(errors).forEach((key: string) => {
            if (this.hasArea(key)) {
                this.state.areas[key].addErrors(errors[key]);
            }
        })
    }

    private hasErrorsForArea(name: string): boolean {
        return !!Object.prototype.hasOwnProperty.call(this.state.errors, name);
    }

    /**
     * Add a new area to the provider
     */
    private addArea(name: string, ref: ValidatorArea) {
        this.setState((prevState) => {
            if (Object.prototype.hasOwnProperty.call(prevState.areas, name)) {
                throw new Error('Validation area names should be unique');
            }

            if (this.hasErrorsForArea(name)) {
                ref.addErrors(this.state.errors[name]);
            }

            return {
                areas: {
                    ...prevState.areas,
                    [name]: ref
                }
            }
        });
    }

    /**
     * Validate all areas within this provider
     */
    private async validate(onValidated?: () => void): Promise<void> {
        const { areas } = this.state;

        this.setState({
            valid: false
        }, async (): Promise<void> => {
            const invalidAreas = (await Promise.all(Object.values(areas)
                .map((area) => area.validate())
            )).filter((valid: boolean) => !valid);

            if (!invalidAreas.length && onValidated) {
                onValidated();
            } else {
                this.setState({
                    valid: true
                })
            }
        });
    }

    /**
     * Returns the properties accessible in the provider component scope
     */
    private getScopedProperties(): ProviderScope {
        return {
            validate: (onValidated?: () => void): Promise<void> => this.validate(onValidated),
            valid: this.state.valid
        };
    }

    /**
     * Gets a list of validation element refs, optionally specified by area name
     */
    private getRefs(name?: string, type?: typeof HTMLElement): HTMLElement[] {
        const refs: HTMLElement[] = [];

        if (name && Object.prototype.hasOwnProperty.call(this.state.areas, name)) {
            this.state.areas[name].getInputRefs().forEach((ref: HTMLElement) => {
                if (!type || (type && ref instanceof type)) {
                    refs.push(ref);
                }
            })
        } else if (name === undefined) {
            Object.values(this.state.areas).forEach((area: ValidatorArea) => {
                area.getInputRefs().forEach((ref) => {
                    if (!type || (type && ref instanceof type)) {
                        refs.push(ref);
                    }
                });
            });
        }

        return refs;
    }

    /**
     * @inheritDoc
     */
    public render(): React.ReactNode {
        const {
            rules
        } = this.props;

        let {
            children
        } = this.props;

        if (typeof children === 'function') {
            children = (children as (scope: ProviderScope) => React.ReactNode)(
                this.getScopedProperties()
            );
        }

        return (
            <ValidatorContext.Provider
                value={{
                    rules: rules || [],
                    addArea: (name: string, ref: ValidatorArea): void => this.addArea(name, ref),
                    getRefs: (name?: string, type?: typeof HTMLElement) => this.getRefs(name, type)
                }}
            >
                {children}
            </ValidatorContext.Provider>
        );
    }
}

export default ValidatorProvider;
