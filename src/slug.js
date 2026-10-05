export function slugify(text, separator = '-') {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(/^[-_]+|[-_]+$/g, '');
}
