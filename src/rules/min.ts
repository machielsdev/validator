import { Rule } from '../Rule';
import { ValidationElement } from '../ValidationElement';
import { capitalize } from '../utils/utils';

export default (value: number): Rule => {
    return {
        passed(elements: ValidationElement[]): boolean {
            let passed = true;

            elements.forEach((element) => {
                if (element instanceof HTMLInputElement
                    || element instanceof HTMLTextAreaElement
                ) {
                    passed = parseFloat(element.value.trim()) >= value;
                }

                if (element instanceof HTMLSelectElement) {
                    passed = parseFloat(element.options[element.selectedIndex].value) >= value;
                }
            });

            return passed;
        },
        message(name: string): string {
            return `${capitalize(name)} should be at least ${value}`
        }
    }
}
