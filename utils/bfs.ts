export default function bfs<T extends { [key: string]: T[] }>(
  tree: T,
  child: keyof T,
  finder: (args: T) => boolean,
): T | undefined {
  let queue = [tree];

  while (queue.length) {
    const head = queue.shift() as T;
    if (finder(head)) {
      return head;
    }

    if (Array.isArray(head[child])) {
      queue.push(...head[child]);
    }
  }
  return;
}
