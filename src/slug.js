export const SEPARATORS = ['-', '_'];

export function slugify(text, separator = '-') {
  if (!SEPARATORS.includes(separator)) {
    throw new RangeError(`separator must be one of: ${SEPARATORS.join(', ')}`);
  }
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(/^[-_]+|[-_]+$/g, '');
}
