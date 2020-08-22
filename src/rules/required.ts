export default {
    passed(elements: HTMLElement[]): boolean {
        let passed = true;

        elements.forEach((element) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
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
