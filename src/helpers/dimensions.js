export function parseDimension(dim) {
  if (!dim) return 1;
  const [valueStr, unit] = dim.split(" ");
  const value = parseFloat(valueStr);
  if (isNaN(value)) return 1;

  switch (unit) {
    case "mm":
      return value / 1000; // 1 mm = 1/1000 m
    case "cm":
      return value / 100; // 1 cm = 1/100 m
    case "m":
      return value; // base unit meter
    default:
      return value; // assume meter if no unit
  }
}
