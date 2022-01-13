import 'jest';

import trimEndWith from './';

describe('trimEndWith test', () => {
  it('12345 trimEnd with 345 eq 12', () => {
    expect(trimEndWith('12345', '345')).toBe('12');
  });

  it('12345 trimEnd with 34 eq 12345', () => {
    expect(trimEndWith('12345', '34')).toBe('12345');
  });
});
