export default async function checkRecaptcha(recaptchaToken) {
  const response = await fetch('/api/auth/recaptcha/verify-recaptcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recaptchaToken }),
  });

  return await response.json();
}
