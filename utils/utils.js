export default function replaceHyphens(inputString) {
  const resultString = inputString.replace(/-/g, '.');
  return resultString;
}
