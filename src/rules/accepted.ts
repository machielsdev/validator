import { getValue, isInputElement, isRadioElement } from '@/common/dom';

export const ACCEPTED_VALUES = [true, 'true', '1', 'yes'];

export default {
    passed(elements: HTMLElement[]): boolean  {
        const isAcceptedValue = (value: string) => ACCEPTED_VALUES.indexOf(value) !== -1;

        return elements.every((element: HTMLElement): boolean => {
            if (isRadioElement(element)) {
                if (element.checked) {
                    return isAcceptedValue(element.value);
                }

                const matchingRadio = document.querySelector<HTMLInputElement>(
                    `input[type="radio"][name="${element.name}"]`
                );

                return !!matchingRadio && isAcceptedValue(matchingRadio.value);
            }

            if (isInputElement(element)) {
                const values = getValue(element);

                return values.every((value: string) => isAcceptedValue(value));
            }

            return true;
        })
    },
    message(): string {
        return '{name} is not accepted.';
    }
};
