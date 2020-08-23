import { ValidationElement } from './ValidationElement';

export type Rule = {
    passed(elements: ValidationElement[]): boolean;
    message(name: string): string;
}
