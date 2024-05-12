export default function replaceHyphens(inputString) {
  const resultString = inputString.replace(/-/g, '.');
  return resultString;
}

export function extractPath(url) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const index = url.indexOf(baseUrl);

  if (index !== -1) {
    return url.slice(index + baseUrl.length);
  } else {
    return url;
  }
}

export function getQueryString(url) {
  const queryString = url.split('proxy-file')[1];
  return queryString;
}
