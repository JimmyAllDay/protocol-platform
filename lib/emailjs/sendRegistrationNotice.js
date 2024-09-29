export default async function sendRegistrationNotice(email) {
  console.log('SEND REGISTRATION button clicked', email);
  try {
    const response = await fetch(
      '/api/auth/sendRegistrationNotice/sendRegistrationNotice',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
