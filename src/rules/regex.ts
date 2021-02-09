import { isInputElement, isSelectElement, getValue } from '../common/dom';


export default {
    passed(elements: HTMLElement[], pattern: string): boolean {
        return elements.every((element: HTMLElement) => {
            const matchesRegex = (value: string) => new RegExp(pattern).test(value);

            if (isInputElement(element) || isSelectElement(element)) {
                const values = getValue(element).filter(Boolean);

                return values.every((value) => matchesRegex(value));
            }

            return true;
        })
    },
    message(): string {
        return 'regex';
    }
}
