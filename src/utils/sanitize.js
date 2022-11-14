export default function sanitize(str) {
  const strValue = str.toString(); // calling tostring incase of numbers
  if (!strValue) {
    return '';
  }
  return strValue.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
