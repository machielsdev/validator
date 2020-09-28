import { getValue, htmlCollectionToArray, isInputElement, isSelectElement } from '@/utils/dom';

describe('dom helpers test', () => {
    it('should convert HtmlCollection to array', () => {
        const select = document.createElement('select');
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        select.appendChild(option1);
        select.appendChild(option2);

        const optionArray = htmlCollectionToArray(select.children);
        expect(Array.isArray(optionArray)).toBeTruthy();
    })

    it('should get value of elements or null', () => {
        const select = document.createElement('select');
        select.multiple = true;
        const option1 = document.createElement('option');
        option1.value = 'foo';
        option1.selected = true;
        const option2 = document.createElement('option');
        option2.value = 'bar';
        option2.selected = true;
        select.appendChild(option1);
        select.appendChild(option2);

        const input = document.createElement('input');
        input.value = 'baz';

        const div = document.createElement('div');

        expect(getValue(select)).toEqual(expect.arrayContaining(['foo', 'bar']));
        expect(getValue(input)).toBe('baz');
        expect(getValue(div)).toBeNull();
    });

    it('should check whether an element is an input element', () => {
        const input = document.createElement('input');
        const textarea = document.createElement('textarea');

        expect(isInputElement(input)).toBeTruthy();
        expect(isInputElement(textarea)).toBeTruthy();
    });

    it('should check whether an element is an input element', () => {
        const select = document.createElement('select');

        expect(isSelectElement(select)).toBeTruthy();
    });
});
