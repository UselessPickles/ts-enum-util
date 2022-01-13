interface args {
  num: string | number;
  split: any;
  limit: number;
}

export default function reverseSplitJoin({ num, split, limit }: args) {
  // 容灾
  if (!num) return '';

  const [integer, decimal = ''] = num?.toString()?.split('.');

  let l = integer.length,
    p = l,
    str = '';

  while ((p -= limit) > 0) {
    str = `${split}${integer.slice(p, l)}${str}`;
    l = p;
  }

  str = `${integer.slice(0, l)}${str}`;

  return `${str}${decimal && `.${decimal}`}`;
}
