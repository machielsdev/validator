import { ValidationElement } from '../ValidationElement';

export default {
    passed(elements: ValidationElement[], ...values: string[]): boolean {
        let passed = true;

        elements.forEach((element) => {
            if (element instanceof HTMLInputElement
                || element instanceof HTMLTextAreaElement
            ) {
                passed = parseFloat(element.value.trim()) >= parseInt(values[0]);
            }

            if (element instanceof HTMLSelectElement) {
                passed = parseFloat(element.options[element.selectedIndex].value) >= parseInt(values[0]);
            }
        });

        return passed;
    },
    message(): string {
        return `{name} should be at least {0}`
    }
}
