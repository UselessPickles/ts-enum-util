import setTo from './';

describe('setTo test', () => {
  it("setTo(undefined, ['a', 1, '3'], '123') => { a: [, [, , , '123']] }", () => {
    expect(setTo(undefined, ['a', 1, '3'], '123')).toEqual({ a: [, [, , , '123']] });
  });
});
