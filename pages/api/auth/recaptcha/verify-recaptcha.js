export default async function handler(req, res) {
  const { recaptchaToken } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    const response = await fetch(verificationUrl, { method: 'POST' });
    const data = await response.json();

    if (data.success) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
