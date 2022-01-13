export default function dfs<T extends { [key: string]: T[] | any }>(
  tree: T,
  child: keyof T,
  finder: (tree: T, pTree?: T) => boolean,
  pTree?: T,
): T | undefined {
  if (finder(tree, pTree)) {
    return tree;
  }

  let res;
  const children: T[] = tree?.[child] ?? [];

  for (const node of children) {
    res = dfs(node, child, finder, tree);
    if (res) break;
  }

  return res;
}

export function dfsMap<T extends { [key: string]: T[] | any }, P extends T = T>(
  tree: T,
  child: keyof T,
  mapper: (tree: T, pTree?: T) => P,
  pTree?: T,
): P {
  const newTree: P = mapper(tree, pTree),
    children: T[] = newTree?.[child] ?? [];

  for (let i = 0; i < children?.length; i++) {
    const node = children?.[i];
    children[i] = dfsMap(node, child, mapper, newTree);
  }

  return newTree;
}
