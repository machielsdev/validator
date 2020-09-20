import * as React from 'react';
import { ValidatorContext } from './ValidatorContext';
import { RuleOptions } from './RuleOptions';
import ValidatorArea from './ValidatorArea';
import { ProviderScope } from './ProviderScope';
import { Messages } from './Messages';

export interface ValidatorProviderProps {
    rules?: RuleOptions;
    children?: React.ReactNode | ((scope: ProviderScope) => React.ReactNode);
}

interface ValidatorProviderState {
    areas: Record<string, ValidatorArea>;
    errors: Messages
}

class ValidatorProvider extends React.Component<ValidatorProviderProps, ValidatorProviderState> {
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
                    addArea: (name: string, ref: ValidatorArea): void => this.addArea(name, ref)
                }}
            >
                {children}
            </ValidatorContext.Provider>
        );
    }
}

export default ValidatorProvider;
