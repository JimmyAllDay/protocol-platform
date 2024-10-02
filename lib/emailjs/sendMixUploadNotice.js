export default async function sendMixUploadNotice(email) {
  try {
    const response = await fetch(
      '/api/uploads/sendMixUploadNotice/sendMixUploadNotice',
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
    //* This is a non-crtical function and is only being logged
    console.error('Error sending admin notification email: ', error);
    //Do not rethrow
  }
}
