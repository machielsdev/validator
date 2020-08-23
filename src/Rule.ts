import { ValidationElement } from './ValidationElement';

export type Rule = {
    passed(element: ValidationElement[]): boolean;
    message(element: ValidationElement[]): string;
}
