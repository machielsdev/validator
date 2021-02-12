import { arraysEqual } from '../../../src/common/utils';

describe('utils test', () => {
    it('should check if arrays are equal', () => {
        expect(arraysEqual(['foo'], ['foo'])).toBeTruthy();
    });

    it('should check if arrays are not equal', () => {
        expect(arraysEqual(['foo'], ['bar'])).toBeFalsy();
    });

    it('should check if arrays are not equal', () => {
        expect(arraysEqual(['foo'], ['foo', 'bar'])).toBeFalsy();
    });
});
