import React from 'react';
import { RuleOptions } from './RuleOptions';
import { ValidatorArea } from './components/ValidatorArea';

export interface ValidatorContextProps {
    rules: RuleOptions;
    addArea: (name: string, ref: ValidatorArea) => void;
    getRefs: (name?: string, type?: typeof HTMLElement) => HTMLElement[];
    getArea: (name: string) => ValidatorArea | undefined;
}

export const ValidatorContext = React.createContext<ValidatorContextProps>({
    rules: [],
    addArea: () => undefined,
    getRefs: () => [],
    getArea: () => undefined
});
