import { ValidationElement } from '../ValidationElement';

export default {
    passed(elements: ValidationElement[], value: string): boolean {
        let passed = true;

        elements.forEach((element) => {
            if (element instanceof HTMLInputElement
                || element instanceof HTMLTextAreaElement
            ) {
                passed = parseFloat(element.value.trim()) <= parseInt(value, 10);
            }

            if (element instanceof HTMLSelectElement) {
                passed = parseFloat(element.options[element.selectedIndex].value) <= parseInt(value, 10);
            }
        });

        return passed;
    },
    message(): string {
        return `{name} should be not greater than {0}`
    }
}
