import React from 'react';
import { RuleOptions } from './RuleOptions';
import ValidatorArea from './ValidatorArea';

export interface ValidatorContextProps {
    rules: RuleOptions;
    addArea: (name: string, ref: ValidatorArea) => void;
    validate: () => void;
}

export const ValidatorContext = React.createContext<ValidatorContextProps>({
    rules: [],
    addArea: () => undefined,
    validate: () => undefined
});
