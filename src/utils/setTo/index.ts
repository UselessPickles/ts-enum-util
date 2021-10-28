export type Key = string | number | symbol;

export default function setTo(point: any, path: Key[] | Key, value: any) {
  const safePath = ([] as Key[]).concat(path),
    curKey = safePath[0];

  let origin: any = point;
  console.log(point, curKey);
  if (point == undefined) {
    switch (typeof curKey) {
      case 'number':
        {
          origin = [];
        }
        break;
      case 'string':
      case 'symbol':
        {
          origin = {};
        }
        break;
      default:
        throw new Error(`invalid key type: ${curKey}, except string | number | symbol`);
    }
  } else if (typeof point !== 'object') {
    throw new Error(`invalid point type: ${point}, except array | object`);
  }

  //   if (Array.isArray(origin) && Number.isNaN(Number.parseInt(curKey as string))) {
  //     throw new Error(`invalid point type: ${point}, except array | object`);
  //   }

  if (safePath?.length === 1) {
    origin[curKey] = value;
    return origin;
  }

  setTo(origin[curKey], safePath?.slice(1), value);
  return origin;
}
