import {
    isCheckboxElement,
    isRadioElement, nodeListToArray
} from '@/common/dom';


export default {
    passed(elements: HTMLElement[]): boolean  {
        return elements.every((element: HTMLElement): boolean => {
            if (isCheckboxElement(element)) {
                return element.checked;
            }

            if (isRadioElement(element)) {
                if (element.checked) {
                    return true;
                }

                const radios = nodeListToArray<HTMLInputElement>(document.querySelectorAll<HTMLInputElement>(
                    `input[type="radio"][name="${element.name}"]`
                ));

                return !!radios.length && radios.some((radio: HTMLInputElement) => radio.checked);
            }

            return true;
        })
    },
    message(): string {
        return '{name} is not checked.';
    }
};
