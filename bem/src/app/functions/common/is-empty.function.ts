export function isEmpty(item: {} | null | undefined) {
  if (item === undefined || item === null) {
    return true;
  }
  return Object.keys(item).length === 0;
}
