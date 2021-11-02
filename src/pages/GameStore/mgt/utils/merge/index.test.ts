import type { VER_INFO } from './';
import merge from './';

describe('merge test', () => {
  const obj1: VER_INFO = { status: 'status1', row: '233' },
    obj2: VER_INFO = { status: 'status2', version: 1.1 },
    obj3: VER_INFO = { row: '3', version: 1.3 };

  it('merge(obj1, obj2)', () => {
    expect(merge(obj1, obj2)).toEqual({
      status: ['status1', 'status2'],
      row: ['233', undefined],
      version: [undefined, 1.1],
    });
  });

  it('merge(obj1)', () => {
    console.log(merge(obj1));
    expect(merge(obj1)).toEqual({ status: ['status1'], row: ['233'] });
  });

  it('merge(ob1, obj2, obj3)', () => {
    expect(merge(obj1, obj2, obj3)).toEqual({
      status: ['status1', 'status2', undefined],
      row: ['233', undefined, '3'],
      version: [undefined, 1.1, 1.3],
    });
  });
});
