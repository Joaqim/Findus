export const toNumber = (value: Readonly<string | number>): number =>
  typeof value === "string" ? parseFloat(value) : value;
