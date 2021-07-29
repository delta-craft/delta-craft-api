export const isUuidValid = (uuid: string): boolean =>
  /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(
    uuid,
  );

export const filterUniqueInArray = (value, index, self) =>
  self.indexOf(value) === index;
