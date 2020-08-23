import { ValidationElement } from '../ValidationElement';

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

    message(): string {
        return 'This field is required';
    }
};
