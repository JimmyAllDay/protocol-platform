import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';
import { isEmail } from 'validator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || !isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_REGISTRATION_NOTICE_TEMPLATE_ID;

  if (
    !serviceId ||
    !templateId ||
    !process.env.EMAILJS_PUBLIC_KEY ||
    !process.env.EMAILJS_PRIVATE_KEY
  ) {
    return res
      .status(500)
      .json({ error: 'Missing email service configuration' });
  }

  const templateParams = {
    email: email,
    name: email,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    });
    res.status(200).json({ message: 'Email sent successfully', response });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
