import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';

export default async function handler(req, res) {
  const body = await req.body;

  const name = body.name;
  const email = body.email;
  const phone = body.phone;
  const message = body.message;

  const templateParams = {
    name: name,
    email: email,
    phone: phone,
    message: message,
  };

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;

  try {
    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    });
  } catch (error) {
    if (error instanceof EmailJSResponseStatus) {
      console.log('EMAILJS FAILED...', error);
      return;
    }
    console.log('ERROR', error);
    res.status(error.status).json({ text: error.text });
  }
  res.status(200).json({ text: 'Form submitted' });
}
