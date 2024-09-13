const isDef = (value: unknown) => value !== undefined;
const isString = (value: any) =>
  typeof value === "string" && Object.prototype.toString.call(value) === "[object String]";
const isNumber = (value: any) =>
  !isNaN(value) && Object.prototype.toString.call(value) === "[object Number]";
const extend = Object.assign;

const splitString = (str: string, chunkSize: number) => {
  const regex = new RegExp(`.{1,${chunkSize}}`, "g");
  return str.match(regex) || [];
};

const isHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
const isRgbColor = (color: string) => /^rgb\((\s*\d+\s*,){2}\s*\d+\s*\)$/.test(color);
const supportNamedColors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "gray", // alias blackBright
  "grey", // alias blackBright
] as const;
type SupportNamedColor = (typeof supportNamedColors)[number];
const isNamedColor = (color: string): color is SupportNamedColor => {
  return supportNamedColors.includes(color.toLowerCase() as SupportNamedColor);
};
const isValidColor = (color: string) =>
  color && (isHexColor(color) || isRgbColor(color) || isNamedColor(color));

/**
 * only support kebab-string
 * @param str 
 * @returns 
 */
const toCamelCase = (str: string) => {
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
};

const convertKeysToCamelCase = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce((acc, key: string) => {
    const camelKey = toCamelCase(key);
    acc[camelKey] = obj[key];
    return acc;
  }, {} as Record<string, any>);
};

export {
  isDef,
  extend,
  splitString,
  isHexColor,
  isRgbColor,
  isNamedColor,
  isValidColor,
  supportNamedColors,
  toCamelCase,
  convertKeysToCamelCase,
};
export type { SupportNamedColor };
