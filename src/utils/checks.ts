export const isUuidValid = (uuid: string): boolean =>
  /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(
    uuid,
  );

export const isIPv4Valid = (ip: string): boolean =>
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip,
  );

export const filterUniqueInArray = (value, index, self) =>
  self.indexOf(value) === index;

export const minutesBetween = (date1: Date, date2: Date): number => {
  if (!date1 || !date2) return Number.POSITIVE_INFINITY;

  const t1 = date1.getTime();
  const t2 = date2.getTime();

  const diff = t1 > t2 ? t1 - t2 : t2 - t1; // Difference in ms timestamp format
  const d = Math.abs(diff);

  // Works for now
  return Math.round(((d % 86400000) % 3600000) / 60000);

  // TODO: Fix

  // const dMins = Math.floor(diff / (1000 * 60)); // 60 seconds in a minute * 1000 milliseconds in a second
  // console.log(dMins);
  // return dMins;
};
