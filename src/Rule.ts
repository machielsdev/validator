import { ValidationElement } from './ValidationElement';

export type Rule = {
    passed(elements: ValidationElement[], ...args: string[]): boolean;
    message(): string;
}
