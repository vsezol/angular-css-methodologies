export function isNil(entity: unknown): entity is null | undefined {
  return entity === undefined || entity === null;
}
