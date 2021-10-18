export function trimLeftWith(str: string, char: string) {
  let i = -1;
  while (++i < str?.length && str[i] === char) {}
  return str?.slice(i);
}

export function trimRightWith(str: string, char: string) {
  let i = str?.length;
  while (i-- && str[i] === char) {}
  return str?.slice(0, i + 1);
}
