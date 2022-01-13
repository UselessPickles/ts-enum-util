import type { Node } from './';
import Chain from './';

describe('chian test', () => {
  class TestChain extends Chain<Node> {}

  const n1: Node = {};
  const n2: Node = {};
  const n3: Node = {};

  const c = new TestChain(n1);

  it('find test', () => {
    expect(c.Find((i) => i === n1)).toBe(n1);
  });

  it('append test', () => {
    c.Append(n1, n2);
    expect(c.Find((i) => i === n1)?.next).toBe(n2);
  });

  it('prepend test', () => {
    c.Prepend(n1, n3);
    expect(c.Find((i) => i === n3)?.next).toBe(n1);
  });

  it('remove test', () => {
    c.Remove(n1);
    expect(c.Find((i) => i === n1)).toBe(null);
  });
});
