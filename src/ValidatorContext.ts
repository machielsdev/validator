import React from 'react';
import { RuleOptions } from '@/RuleOptions';
import { ValidatorArea } from '@/components/ValidatorArea';

export interface ValidatorContextProps {
    rules: RuleOptions;
    addArea: (name: string, ref: ValidatorArea) => void;
}

export const ValidatorContext = React.createContext<ValidatorContextProps>({
    rules: [],
    addArea: () => undefined
});
