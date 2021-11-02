export type MapLike<K = any, V = any> = Map<K, V> | Record<any, V>;

export class Options {
  private m = new Map<any, any>();

  constructor(m?: MapLike) {
    this.m = this.convertMap(m);
  }

  private convertMap(m?: MapLike) {
    if (m instanceof Map) {
      return new Map(m);
    } else if (typeof m === 'object') {
      return new Map(Object?.entries(m));
    }

    console.warn(`invalid type: ${m}, expect map or record`);
    return new Map();
  }

  public get copy() {
    return new Options(this.m);
  }

  public unshift(m: MapLike) {
    return new Options([...this.convertMap(m), ...this.m]);
  }

  public push(m: MapLike) {
    return new Options(new Map([...this.m, ...this.convertMap(m)]));
  }
  public insert(k: keyof MapLike, m: MapLike) {
    const copy = [...this.m],
      idx = copy.findIndex(([key]) => k === key);
    return new Options(
      new Map(([] as any[]).concat(copy.slice(0, idx), [...this.convertMap(m)], copy.slice(idx))),
    );
  }

  public replace(m: MapLike<keyof MapLike, MapLike>) {
    let copy = this.copy;
    [...this.convertMap(m)].forEach(([k, v]) => {
      copy = copy.insert(k, v).remove(k);
    });
    return copy;
  }

  public remove(...keys: any[]) {
    const copy = this.copy;
    keys?.forEach((k) => copy.m.delete(k));
    return copy;
  }

  // 交换 [key value] => [value key]
  public get vk() {
    return new Options(new Map([...this.m].map(([k, v]) => [v, k])));
  }

  public get toMap() {
    return this.copy.m;
  }

  public get toOpt() {
    return [...this.m].map(([k, v]) => ({ label: v, value: k }));
  }

  public get toObj() {
    return [...this.m].reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  }
}

export default (m?: MapLike) => {
  return new Options(m);
};
