import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body; // New user email

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_REGISTRATION_NOTICE_TEMPLATE_ID;

    const templateParams = {
      email: email,
    };

    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY,
          privateKey: process.env.EMAILJS_PRIVATE_KEY,
        }
      );
      res.status(200).json({ message: 'Email sent successfully', response });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
