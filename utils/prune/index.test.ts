import isValidValue from '../../utils/isValidValue';
import prune from './';

describe('prune test', () => {
  it('[] === undefined', () => {
    expect(prune([], isValidValue)).toEqual(undefined);
  });

  it('[{}] === undefined', () => {
    console.log(prune([{}], isValidValue));
    expect(prune([{}], isValidValue)).toEqual(undefined);
  });

  it('[{}, {}, {}, false] === [false]', () => {
    expect(prune([{}, {}, {}, false], isValidValue)).toEqual([false]);
  });

  it('[{}, {}, [], [[[[[[[[[[[]]]]]]]]]]]] === undefine', () => {
    expect(prune([{}, {}, [], [[[[[[[[[[[]]]]]]]]]]]], isValidValue)).toEqual(undefined);
  });

  it("[{}, {}, [], [[[[[[[[[[[{ a: 'a' }]]]]]]]]]]]] === [[[[[[[[[[[[{ a: 'a' }]]]]]]]]]]]]", () => {
    expect(prune([{}, {}, [], [[[[[[[[[[[{ a: 'a' }]]]]]]]]]]]], isValidValue)).toEqual([
      [[[[[[[[[[[{ a: 'a' }]]]]]]]]]]],
    ]);
  });

  it('[{}, {}, [], [[[[[[[[[[[{ a: undefined }]]]]]]]]]]]] === undefine', () => {
    expect(prune([{}, {}, [], [[[[[[[[[[[{ a: undefined }]]]]]]]]]]]], isValidValue)).toEqual(
      undefined,
    );
  });

  it("[{ a: 'a' }, { b: [] }, [{}, [1]], [[[[[[[[[[[{ a: undefined }]]]]]]]]]]]] === [{ a: 'a' }, [[1]]]", () => {
    expect(
      prune(
        [{ a: 'a' }, { b: [] }, [{}, [1]], [[[[[[[[[[[{ a: undefined }]]]]]]]]]]]],
        isValidValue,
      ),
    ).toEqual([{ a: 'a' }, [[1]]]);
  });
});
