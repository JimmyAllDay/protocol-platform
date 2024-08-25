export default function getFirstName(fullName) {
  // Split the input string by spaces
  const names = fullName.split(' ');
  // Return the first element of the resulting array
  return names[0];
}

export function getSurname(fullName) {
  // Split the input string by spaces
  const names = fullName.split(' ');
  // Return the first element of the resulting array
  return names[1];
}
