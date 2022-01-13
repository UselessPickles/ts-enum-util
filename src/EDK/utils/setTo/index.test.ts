import setTo from './';

describe('setTo test', () => {
  it("setTo(undefined, ['a', 1, '3'], '123') => { a: [, [, , , '123']] }", () => {
    expect(setTo(undefined, ['a', 1, '3'], '123')).toEqual({ a: [, [, , , '123']] });
  });

  it("setTo({}, ['a', 1, '3'], '123') => { a: [, [, , , '123']] }", () => {
    expect(setTo({}, ['a', 1, '3'], '123')).toEqual({ a: [, [, , , '123']] });
  });

  it('throw error', () => {
    expect(() => setTo([], ['a', 1, '3'], '123')).toThrowError(
      new Error('cannot use a type other than a number as an array key'),
    );
  });
});
