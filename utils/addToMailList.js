export const addToMailList = async (email) => {
  const response = await fetch('/api/contact/addToMailList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Error adding to mail list');
  }

  const data = await response.json();
  return data.success;
};
