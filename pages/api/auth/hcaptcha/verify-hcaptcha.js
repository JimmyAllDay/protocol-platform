export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token || token.trim() === '') {
    return res
      .status(400)
      .json({ success: false, message: 'No token provided' });
  }

  const secretKey = process.env.HCAPTCHA_SECRET_KEY;

  try {
    const response = await fetch(`https://hcaptcha.com/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Verification failed' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
