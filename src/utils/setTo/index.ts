export type Key = string | number | symbol;
export type Pointer<T = any> = T[] | Record<Key, T> | undefined | null;
export enum VALID_TYPE {
  ARRAY,
  OBJECT,

  NUMBER,
  STRING,
  SYMBOL,

  UNDEFINED,
}

export function likeNumber(n: string) {
  return !Number.isNaN(Number.parseInt(n));
}

export function getKeyType(key: Key) {
  switch (typeof key) {
    case 'number':
      return VALID_TYPE.NUMBER;
    case 'string':
      if (likeNumber(key)) {
        return VALID_TYPE.NUMBER;
      }
      return VALID_TYPE.STRING;
    case 'symbol':
      return VALID_TYPE.SYMBOL;
    default:
      throw new Error(`invalid key type: ${key}, except string | number | symbol`);
  }
}
export function getPointersType(pointer?: Pointer) {
  if ((pointer ?? true) === true) {
    return VALID_TYPE.UNDEFINED;
  }

  if (Array.isArray(pointer)) {
    return VALID_TYPE.ARRAY;
  }

  if (typeof pointer === 'object') {
    return VALID_TYPE.OBJECT;
  }

  throw new Error(`invalid pointer type: ${pointer}, except array | object | undefined | null`);
}

export default function setTo(pointer: Pointer, path: Key[] | Key, value: any) {
  const safePath = ([] as Key[]).concat(path),
    key = safePath[0],
    keyType = getKeyType(key),
    pointerType = getPointersType(pointer);
  let origin = pointer;

  if (keyType !== VALID_TYPE.NUMBER && pointerType === VALID_TYPE.ARRAY) {
    throw new Error('cannot use a type other than a number as an array key');
  }

  if (pointerType === VALID_TYPE.UNDEFINED) {
    switch (keyType) {
      case VALID_TYPE.NUMBER:
        origin = [];
        break;
      case VALID_TYPE.STRING:
      case VALID_TYPE.SYMBOL:
        origin = {};
        break;
      default:
        throw new Error(`invalid key type: ${keyType}, except string | number | symbol`);
    }
  }

  if (safePath?.length === 1) {
    (origin as any)![key] = value;
    return origin;
  }

  (origin as any)![key] = setTo((origin as any)![key], safePath?.slice(1), value);
  return origin;
}
