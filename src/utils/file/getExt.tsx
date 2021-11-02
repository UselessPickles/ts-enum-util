export default function getExt(fileName: string): string {
  const arr = fileName?.split?.('.') ?? [];
  return arr[arr?.length - 1];
}
