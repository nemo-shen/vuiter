const isDef = (value: unknown) => value !== undefined;
const isString = (value: any) =>
  typeof value === "string" && Object.prototype.toString.call(value) === "[object String]";
const isNumber = (value: any) =>
  !isNaN(value) && Object.prototype.toString.call(value) === "[object Number]";
const extend = Object.assign;

const splitString = (str: string, chunkSize: number) => {
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return str.match(regex) || [];
}

export {
  isDef,
  extend,
  splitString,
}
