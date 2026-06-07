/** Compare MongoDB ObjectIds or string ids safely */
export const idsEqual = (a, b) => {
  if (a == null || b == null) return false;
  return String(a) === String(b);
};

export const arrayIncludesId = (arr, id) => {
  if (!Array.isArray(arr) || id == null) return false;
  return arr.some((item) => idsEqual(item, id));
};
