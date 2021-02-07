import {
    Validator,
    activeUrl
} from '../../../src';
import fetchMock from 'jest-fetch-mock';

describe('test activeUrl rule', () => {
    beforeEach(() => {
        Validator.extend('active_url', activeUrl);
        fetchMock.mockResponse((req: Request) => {
            if (req.url === 'https://example.com/success') {
                return Promise.resolve({ status: 200 });
            } else {
                return Promise.resolve({ status: 404 });
            }
        })
    });

    it('should always validate inputs and not validate non-inputs', async () => {
        const input = document.createElement('input');
        input.value = 'https://example.com'
        const canvas = document.createElement('canvas');

        const validator_input = new Validator([
            input
        ],
        ['active_url'],
        '');

        const validator_canvas = new Validator([
            canvas
        ],
        ['active_url'],
        '');

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);
    });
});
