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
type BgColorNames = `bg${Capitalize<(typeof supportNamedColors)[number]>}`;
const isNamedColor = (color: string): boolean => {
  if (!color) {
    return false;
  }
  return supportNamedColors.includes(color.toLowerCase() as SupportNamedColor);
};
const isValidColor = (color: string) =>
  color && (isHexColor(color) || isRgbColor(color) || isNamedColor(color));
const extractRGBValues = (rgbString: string): { red: number; green: number; blue: number } => {
  const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const match = rgbString.match(regex);

  if (match) {
    // 解析并返回 RGB 值
    const red = parseInt(match[1], 10);
    const green = parseInt(match[2], 10);
    const blue = parseInt(match[3], 10);

    return { red, green, blue };
  } else {
    throw new Error("Invalid RGB string format");
  }
};

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
  return Object.keys(obj).reduce(
    (acc, key: string) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = obj[key];
      return acc;
    },
    {} as Record<string, any>,
  );
};

/**
 * 首字母大写
 * @param str {string}
 * @returns {string}
 */
const capitalize = (str: string): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  extractRGBValues,
  capitalize,
};
export type { SupportNamedColor, BgColorNames };
