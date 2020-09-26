import * as React from 'react';
import { Messages } from '@/Messages';
import { RuleOptions } from '@/RuleOptions';
import { ProviderScope } from '@/ProviderScope';
import { ValidatorContext } from '@/ValidatorContext';
import { ValidatorArea } from '@/components/ValidatorArea';
import { ValidationElement } from '@/ValidationElement';

export interface ValidatorProviderProps {
    rules?: RuleOptions;
    children?: React.ReactNode | ((scope: ProviderScope) => React.ReactNode);
}

interface ValidatorProviderState {
    areas: Record<string, ValidatorArea>;
    errors: Messages
}

export class ValidatorProvider extends React.Component<ValidatorProviderProps, ValidatorProviderState> {
    public readonly state: ValidatorProviderState = {
        areas: {},
        errors: {}
    }

    /**
     * Add a new area to the provider
     */
    private addArea(name: string, ref: ValidatorArea) {
        this.setState((prevState) => {
            if (Object.prototype.hasOwnProperty.call(prevState.areas, name)) {
                throw new Error('Validation area names should be unique');
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

        const dirtyAreas = (await Promise.all(Object.values(areas)
            .map((area) => area.validate())
        )).filter((clean) => !clean);

        if (!dirtyAreas.length && onValidated) {
            onValidated();
        }
    }

    /**
     * Returns the properties accessible in the provider component scope
     */
    private getScopedProperties(): ProviderScope {
        return {
            validate: (onValidated?: () => void): Promise<void> => this.validate(onValidated)
        };
    }

    private getRefs(name?: string): ValidationElement[] {
        const refs: ValidationElement[] = [];

        if (name && Object.prototype.hasOwnProperty.call(this.state.areas, name)) {
            this.state.areas[name].getInputRefs().forEach((ref: ValidationElement) => {
                refs.push(ref);
            })
        } else if (name === undefined) {
            Object.values(this.state.areas).forEach((area: ValidatorArea) => {
                area.getInputRefs().forEach((ref) => {
                    refs.push(ref);
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
                    getRefs: (name?: string) => this.getRefs(name)
                }}
            >
                {children}
            </ValidatorContext.Provider>
        );
    }
}

export default ValidatorProvider;
