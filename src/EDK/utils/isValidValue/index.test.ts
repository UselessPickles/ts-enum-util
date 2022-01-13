import 'jest';

import isValidValue from './';

describe('isValidValue test', () => {
  it('[] is not valid', () => {
    expect(isValidValue([])).toBe(false);
  });
  it('{} is not valid', () => {
    expect(isValidValue({})).toBe(false);
  });
  it('null is not valid', () => {
    expect(isValidValue(null)).toBe(false);
  });
  it('undefined is not valid', () => {
    expect(isValidValue(undefined)).toBe(false);
  });

  it('"" is not valid', () => {
    expect(isValidValue('')).toBe(false);
  });
  it('false is valid', () => {
    expect(isValidValue(false)).toBe(true);
  });

  it('0 is valid', () => {
    expect(isValidValue(0)).toBe(true);
  });
});
