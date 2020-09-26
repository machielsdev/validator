import React from 'react';
import { RuleOptions } from '@/RuleOptions';
import { ValidatorArea } from '@/components/ValidatorArea';
import { ValidationElement } from '@/ValidationElement';

export interface ValidatorContextProps {
    rules: RuleOptions;
    addArea: (name: string, ref: ValidatorArea) => void;
    getRefs: (name?: string) => ValidationElement[];
}

export const ValidatorContext = React.createContext<ValidatorContextProps>({
    rules: [],
    addArea: () => undefined,
    getRefs: () => []
});
