export interface Node {
  next?: Node;
}

export default abstract class Chain<N extends { next?: N }> {
  protected head: N | undefined;

  constructor(...n: (N | undefined)[]) {
    for (let i = 1; i < n.length; i++) {
      const ptr = n[i - 1];
      if (ptr !== undefined) {
        ptr.next = n[i];
      }
    }

    this.head = n?.[0];
  }

  [Symbol.iterator] = () => {
    let ptr = this.head;
    return {
      next: () => {
        if (ptr) {
          const value = ptr;
          ptr = ptr.next;
          return {
            value,
            done: false,
          };
        } else {
          return { done: true };
        }
      },
    };
  };

  public Find = <F extends (head: Chain<N>['head']) => boolean>(picker: F): N | null => {
    for (const i of this) {
      if (i && picker(i) === true) return i;
    }
    return null;
  };

  public Append = (t: N, ...n: N[]) => {
    if (this.Find((i) => i === t) == null) throw new Error('target node not in this chain');

    const l = n.length;
    if (l === 0) return this;

    for (let i = 1; i < l; i++) {
      n[i - 1].next = n[i];
    }

    const ln = n[l - 1];

    ln.next = t?.next?.next;
    t.next = n?.[0];

    return this;
  };

  public Prepend = (t: N, ...n: N[]) => {
    if (this.Find((i) => i === t) == null) throw new Error('target node not in this chain');

    const l = n.length;
    if (l === 0) return this;

    for (let i = 1; i < l; i++) {
      n[i - 1].next = n[i];
    }

    const ln = n[l - 1];

    if (t === this.head) {
      ln.next = this.head;
      this.head = n?.[0];
    } else {
      const p = this.Find((i) => i?.next === t);
      if (p == null) throw new Error('unknown error in p');

      p.next = ln;
      n[0].next = t;
    }

    return this;
  };

  public Remove = (t: N) => {
    if (this.Find((i) => i === t) == null) throw new Error('target node not in this chain');

    if (t === this.head) {
      this.head = this?.head?.next;
    } else {
      const p = this.Find((i) => i?.next === t);
      if (p == null) throw new Error('unknown error in p');
      p.next = p?.next?.next;
    }

    return this;
  };
}
