export const isDef = (value: unknown) => value !== undefined;
const isString = (value: any) =>
  typeof value === "string" && Object.prototype.toString.call(value) === "[object String]";
const isNumber = (value: any) =>
  !isNaN(value) && Object.prototype.toString.call(value) === "[object Number]";
