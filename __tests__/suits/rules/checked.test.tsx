import {
    Validator,
    checked
} from '../../../src';

describe('test checked rule', (): void => {
    beforeEach((): void => {
        Validator.extend('checked', checked);
    });

    it('should always validate correct elements', async (): Promise<void> => {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('checked', 'checked');

        const radio1 = document.createElement('input');
        radio1.setAttribute('type', 'radio');
        radio1.setAttribute('name', 'test');
        const radio2 = document.createElement('input');
        radio2.setAttribute('type', 'radio');
        radio2.setAttribute('name', 'test');
        document.body.append(radio1, radio2);

        const immediate_radio = document.createElement('input');
        immediate_radio.setAttribute('type', 'radio');
        immediate_radio.setAttribute('checked', 'checked');

        const canvas = document.createElement('canvas');

        const validator_radios = new Validator([
            radio1,
            radio2,
        ],
        ['checked'],
        '');

        const validator_checkbox = new Validator([
            checkbox
        ],
        ['checked'],
        '');

        const validator_canvas = new Validator([
            canvas,
        ],
        ['checked'],
        '');

        const validator_immediate_radio = new Validator([
            immediate_radio,
        ],
        ['checked'],
        '');

        await validator_radios.validate();
        expect(validator_radios.getErrors().length).toBe(1);

        await validator_checkbox.validate();
        expect(validator_checkbox.getErrors().length).toBe(0);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);

        await validator_immediate_radio.validate();
        expect(validator_immediate_radio.getErrors().length).toBe(0);
    });
})
