import { ValidationElement } from '../ValidationElement';
import { capitalize } from '../utils/utils';

export default {
    passed(elements: ValidationElement[]): boolean {
        let passed = true;

        elements.forEach((element) => {
            if (element instanceof HTMLInputElement
                || element instanceof HTMLTextAreaElement
            ) {
                passed = !!element.value.trim().length;
            }

            if (element instanceof HTMLSelectElement) {
                passed = !!element.options[element.selectedIndex].value.length;
            }
        });

        return passed;
    },

    message(name: string): string {
        return `${capitalize(name)} is required`;
    }
};
