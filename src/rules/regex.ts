import { isInputElement, getValue, isSelectElement } from '@/utils/dom';


export default {
    passed(elements: HTMLElement[], pattern: string): boolean {
        return elements.every((element: HTMLElement) => {
            const matchesRegex = (value: string) => new RegExp(pattern).test(value);

            if (isInputElement(element) || isSelectElement(element)) {
                const value = getValue(element);

                if (Array.isArray(value)) {
                    return value.every((val: string) => {
                        return matchesRegex(val);
                    });
                } else {
                    return matchesRegex(value);
                }
            }

            return true;
        })
    },
    message(): string {
        return `{name} should be at least {0}`
    }
}
